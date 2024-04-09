import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const waitlistSchema = z.object({
  email: z.string().email(),
});

export type Waitlist = z.infer<typeof waitlistSchema>;