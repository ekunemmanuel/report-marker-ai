export type QuestionType = "multiple" | "single" | "text" | "text-number";

export interface Question {
  qId: string;
  question: string;
  required: boolean;
  type: QuestionType;
  answer?: string | string[];
  options?: string[];
}

export interface MyForm {
  fId: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FormResponse extends MyForm {
  rId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  uId: string;
  email: string;
  photoURL?: string;
  name?: string;
  plan?: Plan;
  subscription?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface FormHeader {
  // fId: string;
  title: string;
  description: string;
}

export interface Authorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
  account_name?: string | null;
  receiver_bank_account_number?: string | null;
  receiver_bank?: string | null;
}

export interface Customer {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  customer_code: string;
  phone?: string | null;
  metadata?: Record<string, any> | null;
  risk_action: string;
  international_format_phone?: string | null;
}

export interface Plan {
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

export interface Source {
  type: string;
  source: string;
  entry_point: string;
  identifier?: string | null;
}

export interface WebhookData {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message?: string | null;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata?: Record<string, any> | null;
  fees_breakdown?: Record<string, any> | null;
  log?: Record<string, any> | null;
  fees: number;
  fees_split?: Record<string, any> | null;
  authorization: Authorization;
  customer: Customer;
  plan: Plan;
  subaccount?: Record<string, any> | null;
  split?: Record<string, any> | null;
  order_id?: string | null;
  requested_amount?: number;
  pos_transaction_data?: Record<string, any> | null;
  source: Source;
}

export type WebhookEvent =
  | { event: "invoice.create"; data: WebhookData }
  | { event: "invoice.payment_failed"; data: WebhookData }
  | { event: "invoice.update"; data: WebhookData }
  | { event: "subscription.create"; data: WebhookData }
  | { event: "subscription.disable"; data: WebhookData }
  | { event: "subscription.not_renew"; data: WebhookData }
  | { event: "charge.success"; data: WebhookData };
