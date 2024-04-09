import { Schema, model } from "mongoose";

export type QuestionType = "multiple" | "single" | "text" | "text-number";

export interface QuestionDocument extends Document {
  qId: string;
  question: string;
  required: boolean;
  type: QuestionType;
  answer?: string | string[];
  options?: string[];
}

export const QuestionSchema = new Schema<QuestionDocument>(
  {
    qId: { type: String, required: true },
    question: { type: String, required: true },
    required: { type: Boolean, required: true },
    type: {
      type: String,
      enum: ["multiple", "single", "text", "text-number"],
      required: true,
    },
    answer: [String],
    options: {
      type: [String],
      required: function (this: QuestionDocument) {
        return this.type === "multiple" || this.type === "single";
      },
    },
  },
  { timestamps: true }
);
QuestionSchema.pre("save", function (next) {
  // 'this' refers to the Form instance
  this.qId = this._id.toString();
  next();
});
export const Question = model<QuestionDocument>("Question", QuestionSchema);
