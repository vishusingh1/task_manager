import { db } from "../db/drizzle";
import { tasks } from "../db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export const TaskService = {
  createTask: async (data: {
    title: string;
    description?: string;
    priority: string;
    userId: number;
  }) => {
    const result = await db
      .insert(tasks)
      .values({
        title: data.title,
        description: data.description,
        priority: data.priority,
        userId: data.userId,
      })
      .returning();

    return result[0];
  },

  getUserTasks: async (userId: number) => {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  },

  getRecentTasks: async (userId: number, limit = 4) => {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt))
      .limit(limit);
  },

  getSummary: async (userId: number) => {
    const [{ total }] = await db
      .select({ total: sql<number>`count(*)`.as("total") })
      .from(tasks)
      .where(eq(tasks.userId, userId));

    const [{ completed }] = await db
      .select({ completed: sql<number>`count(*)`.as("completed") })
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, userId),
          eq(tasks.status, "completed")
        )
      );

    return {
      total,
      completed,
      pending: total - completed,
    };
  },
};
