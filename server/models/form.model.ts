import { Schema, model } from "mongoose";
import { QuestionDocument, QuestionSchema } from "./question.model";

export interface FormDocument extends Document {
  uId: string;
  fId: string;
  title: string;
  description: string;
  questions: QuestionDocument[];
  createdAt?: string;
  updatedAt?: string;
}
const FormSchema = new Schema<FormDocument>(
  {
    uId: { type: String, index: true },
    fId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
  },
  { timestamps: true }
);

FormSchema.pre("save", function (next) {
  // 'this' refers to the Form instance
  this.fId = this._id.toString();
  next();
});

export const Form = model<FormDocument>("Form", FormSchema);
