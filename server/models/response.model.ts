import { Schema, model, Document } from "mongoose";
import { QuestionSchema } from "./question.model";
import { FormDocument } from "./form.model";

export interface ResponseDocument extends FormDocument {
  rId: string;
  createdAt?: string;
  updatedAt?: string;
}

const ResponseSchema = new Schema<ResponseDocument>(
  {
    rId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
    createdAt: { type: String },
    updatedAt: { type: String },
    fId: { type: String, required: true },
  },
  { timestamps: true }
);

ResponseSchema.pre("save", function (next) {
  // 'this' refers to the Form instance
  this.rId = this._id.toString();
  next();
});

export const Response = model<ResponseDocument>(
  "Response",
  ResponseSchema
);
