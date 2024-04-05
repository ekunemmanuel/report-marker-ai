import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  amount: z.coerce.number().gt(10),
  isDaily: z.boolean().optional(),
});

type Schema = z.infer<typeof schema>;

export default defineEventHandler(async (event) => {
  // Post the request object
  const body = await readValidatedBody(event, schema.safeParse);
  if (!body.success) {
    throw createError({
      status: 400,
      message: "Invalid form data",
      data: body.error.formErrors.fieldErrors,
    });
  }

  const data = {
    email: body.data.email,
    amount: body.data.amount * 100,
  };

  try {
    const response = await initPayment(data);

    return response;
  } catch (error) {}
});

async function initPayment(data: Schema) {
  const rumtimeConfig = useRuntimeConfig();
  const secret = rumtimeConfig.paymentTestSecretKey;
  const url = `${rumtimeConfig.paymentApiUrl}/initialize`;

  const plan = data.isDaily ? "PLN_anf47egnltnjscl" : "PLN_tk5wi1ll7mqsdsk";
  const header = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + secret,
  };
  try {
    const response = await $fetch<PaymentResponse>(url, {
      method: "POST",
      headers: {
        ...header,
      },
      body: { ...data, plan, uId: "hello_world" },
    });
    return response;
  } catch (error) {
    console.log(error, "error");

    throw createError({
      status: 400,
      message: "Failed to initialize payment",
    });
  }
}

interface PaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}
