import { Schema, model, Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { PlanDocument, PlanSchema } from "./plan.model";

export interface UserDocument extends Document {
  uId: string;
  email: string;
  photoURL?: string;
  name?: string;
  plan?: PlanDocument;
  subscription?: "active" | "inactive";
  password: string;
  provider: "credentials" | "google";
}

const UserSchema = new Schema(
  {
    photoURL: String,
    name: String,
    plan: PlanSchema,
    email: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    uId: {
      type: String,
      require: true,
      unique: true,
    },

    password: {
      type: String,
      require: true,
      length: [8, "Password must be at least 8 characters long"],
    },

    subscription: {
      type: String,
      enum: ["active", "inactive"],
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  // 'this' refers to the Form instance
  this.uId = this._id.toString();
  next();
});

UserSchema.plugin(uniqueValidator, { message: "Error, {PATH} already exist" });

export const User = model<UserDocument>("User", UserSchema);
