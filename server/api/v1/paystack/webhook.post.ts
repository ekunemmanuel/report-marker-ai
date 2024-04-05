import { createHmac } from "crypto";
import { WebhookEvent } from "~/types";
import { UserRecord, getAuth } from "firebase-admin/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody<WebhookEvent>(event);
  const rumtimeConfig = useRuntimeConfig();
  const secret = rumtimeConfig.paymentTestSecretKey;

  const hash = createHmac("sha512", secret)
    .update(JSON.stringify(body))
    .digest("hex");

  const expectedSignature = event.headers.get("x-paystack-signature");
  if (hash === expectedSignature) {
    console.log({
      webhook: body,
    });
    await handleEvent(body);
  }

  throw createError({
    status: 400,
    message: "Invalid request",
  });
});

async function handleEvent(body: WebhookEvent) {
  const auth = getAuth();
  const email = body.data.customer.email;
  const user = await auth.getUserByEmail("emmanuelapabiekun@gmail.com");

  switch (body.event) {
    case "subscription.create":
    case "charge.success":
    case "invoice.create":
    case "invoice.payment_failed":
    case "invoice.update":
    case "subscription.not_renew":
    case "subscription.disable":
      await updateProfileByEvent(body, user);
      break;
    default:
      console.log(`Unhandled event: ${(<WebhookEvent>body).event}`);
  }
}

async function updateProfileByEvent(body: WebhookEvent, user: UserRecord) {
  const amount = body.data.amount / 100;
  let subscription: "active" | "inactive" = "inactive";

  switch (body.event) {
    case "subscription.create":
    case "charge.success":
    case "invoice.create":
      subscription = "active";
      break;
    case "invoice.payment_failed":
    case "invoice.update":
    case "subscription.not_renew":
    case "subscription.disable":
      subscription = "inactive";
      break;
  }

  await updateProfile(user.uid, {
    subscription,
    plan: {
      ...body.data.plan,
      amount,
    },
  });

  console.log(`Event handled for ${body.data.customer.email}`);
}
