import { Schema, Document, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface WaitlistDocument extends Document {
  email: string;
}

export const WaitlistSchema = new Schema<WaitlistDocument>(
  {
    email: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true }
);
WaitlistSchema.plugin(uniqueValidator, { message: "Error, {PATH} already exist" });

export const Waitlist = model<WaitlistDocument>("Waitlist", WaitlistSchema);
