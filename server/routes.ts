import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivityLogSchema, insertUserChallengeSchema, insertUserRewardSchema, insertUserAnswerSchema, insertUserAchievementSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
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
        name: user.name,
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

  const httpServer = createServer(app);
  return httpServer;
}
