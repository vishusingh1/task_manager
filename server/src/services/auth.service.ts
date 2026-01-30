import { date } from "drizzle-orm/mysql-core";
import { db } from "../db/drizzle";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import { email } from "zod";
import { da } from "zod/v4/locales";


export const AuthService = {
  findByEmail: async (email: string) => {
    const result = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    return result[0] || null;
  },

  createUser: async (data: {name: string; email: string; password: string }) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
     const result = await db 
     .insert(user)
     .values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
     })
     .returning();

     return result[0];
  },

  generateToken: (user: any) => {
    return jwt.sign(
      { id: user.id, email: user.email},
      process.env.JWT_SECRET!,
      { expiresIn: "7d"}
    )
  }
}