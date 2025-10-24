import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivityLogSchema, insertUserChallengeSchema, insertUserRewardSchema, insertUserAnswerSchema, insertUserAchievementSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { openai, TUTOR_SYSTEM_PROMPT } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth (provides /api/login, /api/logout, /api/callback)
  await setupAuth(app);
  
  // ===== AUTHENTICATION ENDPOINTS =====
  
  // GET /api/auth/user - Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let user = await storage.getUser(userId);
      
      // If user doesn't exist, create initial user record and stats
      if (!user) {
        user = await storage.upsertUser({
          id: userId,
          email: req.user.claims.email,
          firstName: req.user.claims.first_name,
          lastName: req.user.claims.last_name,
          profileImageUrl: req.user.claims.profile_image_url,
        });
        
        // Create initial user stats
        await storage.createUserStats({
          userId: user.id,
          points: 0,
          level: 1,
          xp: 0,
          streak: 0,
          lastActivityDate: null,
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  
  // ===== AUTHENTICATED USER ENDPOINTS =====
  
  // GET /api/me - Get current user profile and stats
  app.get("/api/me", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const stats = await storage.getUserStats(userId);
      if (!stats) {
        return res.status(404).json({ error: "User stats not found" });
      }
      
      res.json({ user, stats });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /api/dashboard - Get dashboard data
  app.get("/api/dashboard", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      
      // Get user stats
      const stats = await storage.getUserStats(userId);
      if (!stats) {
        return res.status(404).json({ error: "User stats not found" });
      }
      
      // Get active challenges (not completed)
      const allUserChallenges = await storage.getUserChallenges(userId);
      const activeChallenges = allUserChallenges.filter(uc => !uc.completed);
      
      // Get recent achievements (last 5)
      const allAchievements = await storage.getUserAchievements(userId);
      const recentAchievements = allAchievements.slice(0, 5);
      
      res.json({
        stats,
        activeChallenges,
        recentAchievements,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /api/me/challenges - Get user's challenges with progress
  app.get("/api/me/challenges", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const userChallenges = await storage.getUserChallenges(userId);
      res.json(userChallenges);
    } catch (error) {
      console.error("Error fetching user challenges:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/me/challenges/:id/start - Start a challenge
  app.post("/api/me/challenges/:id/start", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const challengeId = req.params.id;
      
      // Check if challenge exists
      const challenge = await storage.getChallenge(challengeId);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      
      // Check if user already started this challenge
      const existing = await storage.getUserChallenge(userId, challengeId);
      if (existing) {
        return res.status(400).json({ error: "Challenge already started" });
      }
      
      // Create user challenge
      const userChallenge = await storage.createUserChallenge({
        userId,
        challengeId,
        progress: 0,
        completed: false,
        completedAt: null,
      });
      
      res.status(201).json(userChallenge);
    } catch (error) {
      console.error("Error starting challenge:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // PATCH /api/me/challenges/:id/complete - Complete a challenge
  app.patch("/api/me/challenges/:id/complete", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const userChallengeId = req.params.id;
      
      // Fetch the user challenge first
      const existingUserChallenge = await storage.getUserChallengeById(userChallengeId);
      
      if (!existingUserChallenge) {
        return res.status(404).json({ error: "User challenge not found" });
      }
      
      // Verify the challenge belongs to the user BEFORE updating
      if (existingUserChallenge.userId !== userId) {
        return res.status(403).json({ error: "Forbidden - Challenge does not belong to user" });
      }
      
      // Now update the user challenge
      const userChallenge = await storage.updateUserChallenge(userChallengeId, {
        completed: true,
        completedAt: new Date(),
        progress: 100,
      });
      
      if (!userChallenge) {
        return res.status(500).json({ error: "Failed to update user challenge" });
      }
      
      // Get the challenge details
      const challenge = await storage.getChallenge(existingUserChallenge.challengeId);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      
      // Update user stats
      const stats = await storage.getUserStats(userId);
      if (!stats) {
        return res.status(404).json({ error: "User stats not found" });
      }
      
      const updatedStats = await storage.updateUserStats(userId, {
        xp: stats.xp + challenge.xpReward,
        points: stats.points + challenge.xpReward,
      });
      
      // Create activity log
      await storage.createActivityLog({
        userId,
        type: "challenge",
        title: `Completaste '${challenge.title}'`,
        xp: challenge.xpReward,
      });
      
      res.json({ userChallenge, stats: updatedStats });
    } catch (error) {
      console.error("Error completing challenge:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /api/me/rewards - Get user's redeemed rewards
  app.get("/api/me/rewards", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const userRewards = await storage.getUserRewards(userId);
      res.json(userRewards);
    } catch (error) {
      console.error("Error fetching user rewards:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/me/rewards/:id/redeem - Redeem a reward
  app.post("/api/me/rewards/:id/redeem", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const rewardId = req.params.id;
      
      // Get the reward
      const reward = await storage.getReward(rewardId);
      if (!reward) {
        return res.status(404).json({ error: "Reward not found" });
      }
      
      // Check if user has enough points
      const stats = await storage.getUserStats(userId);
      if (!stats) {
        return res.status(404).json({ error: "User stats not found" });
      }
      
      if (stats.points < reward.pointsRequired) {
        return res.status(403).json({ error: "Insufficient points" });
      }
      
      // Deduct points
      const updatedStats = await storage.updateUserStats(userId, {
        points: stats.points - reward.pointsRequired,
      });
      
      // Create user reward
      const userReward = await storage.createUserReward({
        userId,
        rewardId,
      });
      
      // Create activity log
      await storage.createActivityLog({
        userId,
        type: "reward",
        title: `Canjeaste '${reward.title}'`,
        xp: -reward.pointsRequired,
      });
      
      res.status(201).json({ userReward, stats: updatedStats });
    } catch (error) {
      console.error("Error redeeming reward:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /api/me/achievements - Get user's unlocked achievements
  app.get("/api/me/achievements", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /api/me/answers - Get user's answer history
  app.get("/api/me/answers", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      const userAnswers = await storage.getUserAnswers(userId);
      res.json(userAnswers);
    } catch (error) {
      console.error("Error fetching user answers:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/me/answers - Submit an answer
  app.post("/api/me/answers", isAuthenticated, async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub;
      
      // Validate request body
      const validatedData = insertUserAnswerSchema.parse({
        ...req.body,
        userId,
      });
      
      // Get the question
      const question = await storage.getQuestion(validatedData.questionId);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      
      // Create user answer
      const userAnswer = await storage.createUserAnswer(validatedData);
      
      // Get current stats
      const stats = await storage.getUserStats(userId);
      if (!stats) {
        return res.status(404).json({ error: "User stats not found" });
      }
      
      let updatedStats = stats;
      
      // If correct, update user stats
      if (validatedData.isCorrect) {
        updatedStats = await storage.updateUserStats(userId, {
          xp: stats.xp + question.xpReward,
          points: stats.points + question.xpReward,
        }) || stats;
        
        // Create activity log
        await storage.createActivityLog({
          userId,
          type: "question",
          title: `Respondiste correctamente en ${question.subject}`,
          xp: question.xpReward,
        });
      }
      
      res.status(201).json({
        userAnswer,
        stats: updatedStats,
        isCorrect: validatedData.isCorrect,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request body", details: error.errors });
      }
      console.error("Error submitting answer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== LEGACY/BACKWARDS COMPATIBILITY ROUTES =====
  
  // ===== USER STATS ROUTES =====
  app.get("/api/user-stats/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const stats = await storage.getUserStats(userId);
      
      if (!stats) {
        return res.status(404).json({ error: "User stats not found" });
      }
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/user-stats/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      
      const updatedStats = await storage.updateUserStats(userId, updates);
      
      if (!updatedStats) {
        return res.status(404).json({ error: "User stats not found" });
      }
      
      res.json(updatedStats);
    } catch (error) {
      console.error("Error updating user stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== CHALLENGE ROUTES =====
  app.get("/api/challenges", async (_req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/user-challenges/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userChallenges = await storage.getUserChallenges(userId);
      res.json(userChallenges);
    } catch (error) {
      console.error("Error fetching user challenges:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/user-challenges", async (req, res) => {
    try {
      const validatedData = insertUserChallengeSchema.parse(req.body);
      
      // Check if user already started this challenge
      const existing = await storage.getUserChallenge(validatedData.userId, validatedData.challengeId);
      if (existing) {
        return res.status(400).json({ error: "Challenge already started" });
      }
      
      const userChallenge = await storage.createUserChallenge(validatedData);
      res.status(201).json(userChallenge);
    } catch (error) {
      console.error("Error creating user challenge:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/user-challenges/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedChallenge = await storage.updateUserChallenge(id, updates);
      
      if (!updatedChallenge) {
        return res.status(404).json({ error: "User challenge not found" });
      }
      
      res.json(updatedChallenge);
    } catch (error) {
      console.error("Error updating user challenge:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/user-challenges/:id/complete", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      
      // Get the user challenge
      const userChallenge = await storage.updateUserChallenge(id, {
        completed: true,
        completedAt: new Date(),
        progress: 100,
      });
      
      if (!userChallenge) {
        return res.status(404).json({ error: "User challenge not found" });
      }
      
      // Get the challenge details
      const challenge = await storage.getChallenge(userChallenge.challengeId);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      
      // Update user stats
      const stats = await storage.getUserStats(userId);
      if (stats) {
        await storage.updateUserStats(userId, {
          xp: stats.xp + challenge.xpReward,
          points: stats.points + challenge.xpReward,
        });
      }
      
      // Create activity log
      await storage.createActivityLog({
        userId,
        type: "challenge",
        title: `Completaste '${challenge.title}'`,
        xp: challenge.xpReward,
      });
      
      res.json(userChallenge);
    } catch (error) {
      console.error("Error completing challenge:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== REWARD ROUTES =====
  app.get("/api/rewards", async (_req, res) => {
    try {
      const rewards = await storage.getAllRewards();
      res.json(rewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/user-rewards/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userRewards = await storage.getUserRewards(userId);
      res.json(userRewards);
    } catch (error) {
      console.error("Error fetching user rewards:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/user-rewards", async (req, res) => {
    try {
      const validatedData = insertUserRewardSchema.parse(req.body);
      
      // Get the reward
      const reward = await storage.getReward(validatedData.rewardId);
      if (!reward) {
        return res.status(404).json({ error: "Reward not found" });
      }
      
      // Check if user has enough points
      const stats = await storage.getUserStats(validatedData.userId);
      if (!stats || stats.points < reward.pointsRequired) {
        return res.status(400).json({ error: "Not enough points" });
      }
      
      // Deduct points
      await storage.updateUserStats(validatedData.userId, {
        points: stats.points - reward.pointsRequired,
      });
      
      // Create user reward
      const userReward = await storage.createUserReward(validatedData);
      
      // Create activity log
      await storage.createActivityLog({
        userId: validatedData.userId,
        type: "reward",
        title: `Canjeaste '${reward.title}'`,
        xp: -reward.pointsRequired,
      });
      
      res.status(201).json(userReward);
    } catch (error) {
      console.error("Error redeeming reward:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== ACHIEVEMENT ROUTES =====
  app.get("/api/achievements", async (_req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/user-achievements/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/user-achievements", async (req, res) => {
    try {
      const validatedData = insertUserAchievementSchema.parse(req.body);
      
      // Get the achievement
      const achievement = await storage.getAchievement(validatedData.achievementId);
      if (!achievement) {
        return res.status(404).json({ error: "Achievement not found" });
      }
      
      // Create user achievement
      const userAchievement = await storage.createUserAchievement(validatedData);
      
      // Update user stats
      const stats = await storage.getUserStats(validatedData.userId);
      if (stats) {
        await storage.updateUserStats(validatedData.userId, {
          xp: stats.xp + achievement.xpReward,
          points: stats.points + achievement.xpReward,
        });
      }
      
      // Create activity log
      await storage.createActivityLog({
        userId: validatedData.userId,
        type: "achievement",
        title: `Desbloqueaste '${achievement.title}'`,
        xp: achievement.xpReward,
      });
      
      res.status(201).json(userAchievement);
    } catch (error) {
      console.error("Error unlocking achievement:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== QUESTION ROUTES =====
  app.get("/api/questions/:subject", async (req, res) => {
    try {
      const { subject } = req.params;
      const questions = await storage.getQuestionsBySubject(subject);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/user-answers", async (req, res) => {
    try {
      const validatedData = insertUserAnswerSchema.parse(req.body);
      
      // Get the question
      const question = await storage.getQuestion(validatedData.questionId);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      
      // Create user answer
      const userAnswer = await storage.createUserAnswer(validatedData);
      
      // If correct, update user stats
      if (validatedData.isCorrect) {
        const stats = await storage.getUserStats(validatedData.userId);
        if (stats) {
          await storage.updateUserStats(validatedData.userId, {
            xp: stats.xp + question.xpReward,
            points: stats.points + question.xpReward,
          });
        }
        
        // Create activity log
        await storage.createActivityLog({
          userId: validatedData.userId,
          type: "question",
          title: `Respondiste correctamente en ${question.subject}`,
          xp: question.xpReward,
        });
      }
      
      res.status(201).json(userAnswer);
    } catch (error) {
      console.error("Error submitting answer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== ACTIVITY LOG ROUTES =====
  app.get("/api/activity-log/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getUserActivityLog(userId, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activity log:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/activity-log", async (req, res) => {
    try {
      const validatedData = insertActivityLogSchema.parse(req.body);
      const activity = await storage.createActivityLog(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity log:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== PENALTY ROUTE =====
  app.post("/api/penalties", async (req, res) => {
    try {
      const { userId, points, reason } = req.body;
      
      if (!userId || !points || !reason) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      // Update user stats
      const stats = await storage.getUserStats(userId);
      if (!stats) {
        return res.status(404).json({ error: "User stats not found" });
      }
      
      await storage.updateUserStats(userId, {
        points: Math.max(0, stats.points - points),
        xp: Math.max(0, stats.xp - points),
      });
      
      // Create activity log
      const activity = await storage.createActivityLog({
        userId,
        type: "penalty",
        title: "Penalización aplicada",
        xp: -points,
        reason,
      });
      
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error applying penalty:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== DASHBOARD DATA ROUTE =====
  app.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Get user info
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Get user stats
      const stats = await storage.getUserStats(userId);
      if (!stats) {
        return res.status(404).json({ error: "User stats not found" });
      }
      
      // Get user challenges count
      const userChallenges = await storage.getUserChallenges(userId);
      const completedChallenges = userChallenges.filter(uc => uc.completed).length;
      
      // Get user achievements count
      const userAchievements = await storage.getUserAchievements(userId);
      const achievementsUnlocked = userAchievements.length;
      
      // Calculate next level XP (simple formula: level * 300)
      const nextLevelXP = stats.level * 300;
      
      res.json({
        name: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Usuario',
        points: stats.points,
        level: stats.level,
        xp: stats.xp,
        nextLevelXP,
        streak: stats.streak,
        challengesCompleted: completedChallenges,
        achievementsUnlocked,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== AI ASSISTANT ENDPOINTS =====
  
  // POST /api/chat - Send a message to the AI assistant
  app.post("/api/chat", isAuthenticated, async (req, res) => {
    try {
      const { message, conversationHistory = [] } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Build messages array with conversation history
      const messages: any[] = [
        { role: "system", content: TUTOR_SYSTEM_PROMPT }
      ];

      // Add conversation history (limit to last 10 messages for context)
      const recentHistory = conversationHistory.slice(-10);
      messages.push(...recentHistory);

      // Add current user message
      messages.push({ role: "user", content: message });

      // Call OpenAI API
      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-5-mini", // Using mini for faster responses for kids
        messages,
        max_completion_tokens: 500, // Keep responses concise for children
        temperature: 0.8, // Slightly creative but consistent
      });

      const assistantMessage = completion.choices[0]?.message?.content || "Lo siento, no pude generar una respuesta. ¿Puedes intentar de nuevo?";

      res.json({
        message: assistantMessage,
        conversationId: completion.id,
      });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ 
        error: "Error al comunicarse con el asistente",
        message: "Lo siento, tuve un problema. ¿Puedes intentar de nuevo?" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
