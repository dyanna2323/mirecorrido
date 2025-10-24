import {
  type User,
  type InsertUser,
  type UserStats,
  type InsertUserStats,
  type Challenge,
  type InsertChallenge,
  type UserChallenge,
  type InsertUserChallenge,
  type Reward,
  type InsertReward,
  type UserReward,
  type InsertUserReward,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  type Question,
  type InsertQuestion,
  type UserAnswer,
  type InsertUserAnswer,
  type ActivityLog,
  type InsertActivityLog,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // User Stats operations
  getUserStats(userId: string): Promise<UserStats | undefined>;
  createUserStats(stats: InsertUserStats): Promise<UserStats>;
  updateUserStats(userId: string, updates: Partial<Omit<UserStats, 'id' | 'userId'>>): Promise<UserStats | undefined>;

  // Challenge operations
  getAllChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  
  // User Challenge operations
  getUserChallenges(userId: string): Promise<(UserChallenge & { challenge: Challenge })[]>;
  getUserChallenge(userId: string, challengeId: string): Promise<UserChallenge | undefined>;
  createUserChallenge(userChallenge: InsertUserChallenge): Promise<UserChallenge>;
  updateUserChallenge(id: string, updates: Partial<Omit<UserChallenge, 'id'>>): Promise<UserChallenge | undefined>;

  // Reward operations
  getAllRewards(): Promise<Reward[]>;
  getReward(id: string): Promise<Reward | undefined>;
  createReward(reward: InsertReward): Promise<Reward>;

  // User Reward operations
  getUserRewards(userId: string): Promise<(UserReward & { reward: Reward })[]>;
  createUserReward(userReward: InsertUserReward): Promise<UserReward>;

  // Achievement operations
  getAllAchievements(): Promise<Achievement[]>;
  getAchievement(id: string): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // User Achievement operations
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;
  createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;

  // Question operations
  getQuestionsBySubject(subject: string): Promise<Question[]>;
  getQuestion(id: string): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // User Answer operations
  getUserAnswers(userId: string): Promise<UserAnswer[]>;
  createUserAnswer(userAnswer: InsertUserAnswer): Promise<UserAnswer>;

  // Activity Log operations
  getUserActivityLog(userId: string, limit?: number): Promise<ActivityLog[]>;
  createActivityLog(activity: InsertActivityLog): Promise<ActivityLog>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private userStats: Map<string, UserStats>;
  private challenges: Map<string, Challenge>;
  private userChallenges: Map<string, UserChallenge>;
  private rewards: Map<string, Reward>;
  private userRewards: Map<string, UserReward>;
  private achievements: Map<string, Achievement>;
  private userAchievements: Map<string, UserAchievement>;
  private questions: Map<string, Question>;
  private userAnswers: Map<string, UserAnswer>;
  private activityLog: Map<string, ActivityLog>;

  constructor() {
    this.users = new Map();
    this.userStats = new Map();
    this.challenges = new Map();
    this.userChallenges = new Map();
    this.rewards = new Map();
    this.userRewards = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.questions = new Map();
    this.userAnswers = new Map();
    this.activityLog = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username || null,
      password: insertUser.password || null,
      name: insertUser.name,
      email: insertUser.email || null,
      googleId: insertUser.googleId || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      joinedDate: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // User Stats operations
  async getUserStats(userId: string): Promise<UserStats | undefined> {
    return Array.from(this.userStats.values()).find((stats) => stats.userId === userId);
  }

  async createUserStats(insertStats: InsertUserStats): Promise<UserStats> {
    const id = randomUUID();
    const stats: UserStats = {
      id,
      userId: insertStats.userId,
      points: insertStats.points ?? 0,
      level: insertStats.level ?? 1,
      xp: insertStats.xp ?? 0,
      streak: insertStats.streak ?? 0,
      lastActivityDate: insertStats.lastActivityDate || null,
    };
    this.userStats.set(id, stats);
    return stats;
  }

  async updateUserStats(userId: string, updates: Partial<Omit<UserStats, 'id' | 'userId'>>): Promise<UserStats | undefined> {
    const stats = await this.getUserStats(userId);
    if (!stats) return undefined;

    const updated: UserStats = { ...stats, ...updates };
    this.userStats.set(stats.id, updated);
    return updated;
  }

  // Challenge operations
  async getAllChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter((c) => c.isActive);
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const challenge: Challenge = {
      id,
      ...insertChallenge,
      durationDays: insertChallenge.durationDays ?? 1,
      isActive: insertChallenge.isActive ?? true,
    };
    this.challenges.set(id, challenge);
    return challenge;
  }

  // User Challenge operations
  async getUserChallenges(userId: string): Promise<(UserChallenge & { challenge: Challenge })[]> {
    const userChalls = Array.from(this.userChallenges.values()).filter(
      (uc) => uc.userId === userId
    );
    return userChalls.map((uc) => ({
      ...uc,
      challenge: this.challenges.get(uc.challengeId)!,
    }));
  }

  async getUserChallenge(userId: string, challengeId: string): Promise<UserChallenge | undefined> {
    return Array.from(this.userChallenges.values()).find(
      (uc) => uc.userId === userId && uc.challengeId === challengeId
    );
  }

  async createUserChallenge(insertUserChallenge: InsertUserChallenge): Promise<UserChallenge> {
    const id = randomUUID();
    const userChallenge: UserChallenge = {
      id,
      userId: insertUserChallenge.userId,
      challengeId: insertUserChallenge.challengeId,
      progress: insertUserChallenge.progress ?? 0,
      completed: insertUserChallenge.completed ?? false,
      startedAt: new Date(),
      completedAt: insertUserChallenge.completedAt || null,
    };
    this.userChallenges.set(id, userChallenge);
    return userChallenge;
  }

  async updateUserChallenge(id: string, updates: Partial<Omit<UserChallenge, 'id'>>): Promise<UserChallenge | undefined> {
    const userChallenge = this.userChallenges.get(id);
    if (!userChallenge) return undefined;

    const updated: UserChallenge = { ...userChallenge, ...updates };
    this.userChallenges.set(id, updated);
    return updated;
  }

  // Reward operations
  async getAllRewards(): Promise<Reward[]> {
    return Array.from(this.rewards.values()).filter((r) => r.isActive);
  }

  async getReward(id: string): Promise<Reward | undefined> {
    return this.rewards.get(id);
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = randomUUID();
    const reward: Reward = {
      id,
      ...insertReward,
      isActive: insertReward.isActive ?? true,
    };
    this.rewards.set(id, reward);
    return reward;
  }

  // User Reward operations
  async getUserRewards(userId: string): Promise<(UserReward & { reward: Reward })[]> {
    const userRews = Array.from(this.userRewards.values()).filter(
      (ur) => ur.userId === userId
    );
    return userRews.map((ur) => ({
      ...ur,
      reward: this.rewards.get(ur.rewardId)!,
    }));
  }

  async createUserReward(insertUserReward: InsertUserReward): Promise<UserReward> {
    const id = randomUUID();
    const userReward: UserReward = {
      id,
      ...insertUserReward,
      redeemedAt: new Date(),
    };
    this.userRewards.set(id, userReward);
    return userReward;
  }

  // Achievement operations
  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getAchievement(id: string): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = { id, ...insertAchievement };
    this.achievements.set(id, achievement);
    return achievement;
  }

  // User Achievement operations
  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const userAchs = Array.from(this.userAchievements.values()).filter(
      (ua) => ua.userId === userId
    );
    return userAchs.map((ua) => ({
      ...ua,
      achievement: this.achievements.get(ua.achievementId)!,
    }));
  }

  async createUserAchievement(insertUserAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = randomUUID();
    const userAchievement: UserAchievement = {
      id,
      ...insertUserAchievement,
      unlockedAt: new Date(),
    };
    this.userAchievements.set(id, userAchievement);
    return userAchievement;
  }

  // Question operations
  async getQuestionsBySubject(subject: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter((q) => q.subject === subject);
  }

  async getQuestion(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = {
      id,
      ...insertQuestion,
      xpReward: insertQuestion.xpReward ?? 10,
      difficulty: insertQuestion.difficulty ?? 1,
    };
    this.questions.set(id, question);
    return question;
  }

  // User Answer operations
  async getUserAnswers(userId: string): Promise<UserAnswer[]> {
    return Array.from(this.userAnswers.values()).filter((ua) => ua.userId === userId);
  }

  async createUserAnswer(insertUserAnswer: InsertUserAnswer): Promise<UserAnswer> {
    const id = randomUUID();
    const userAnswer: UserAnswer = {
      id,
      ...insertUserAnswer,
      answeredAt: new Date(),
    };
    this.userAnswers.set(id, userAnswer);
    return userAnswer;
  }

  // Activity Log operations
  async getUserActivityLog(userId: string, limit?: number): Promise<ActivityLog[]> {
    const activities = Array.from(this.activityLog.values())
      .filter((a) => a.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? activities.slice(0, limit) : activities;
  }

  async createActivityLog(insertActivity: InsertActivityLog): Promise<ActivityLog> {
    const id = randomUUID();
    const activity: ActivityLog = {
      id,
      ...insertActivity,
      reason: insertActivity.reason || null,
      createdAt: new Date(),
    };
    this.activityLog.set(id, activity);
    return activity;
  }
}

export const storage = new MemStorage();
