import NextAuth, { DefaultSession } from "next-auth"
import type { UserDocument } from "./server/models/user.model"

declare module "next-auth" {
  interface Session  {
    user: {
      uId: string
    } & DefaultSession["user"] 
  }
}