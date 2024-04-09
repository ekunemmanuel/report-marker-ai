import { Schema } from "mongoose";

export interface PlanDocument extends Document {
  id: number;
  name: string;
  plan_code: string;
  description?: string | null;
  amount: number;
  interval: string;
  send_invoices: boolean;
  send_sms: boolean;
  currency: string;
}

export const PlanSchema = new Schema<PlanDocument>({
  id: Number,
  name: String,
  plan_code: String,
  description: String,
  amount: Number,
  interval: String,
  send_invoices: Boolean,
  send_sms: Boolean,
  currency: String,
});
