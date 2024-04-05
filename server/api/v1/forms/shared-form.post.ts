import { z } from "zod";
import { MyForm } from "~/types";

const inputSchema = z.object({
  uId: z.string(),
  fId: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, inputSchema.safeParse);
  if (!body.success) {
    throw body.error.errors.map((e) => e);
  }
  const validData = body.data;

  const res = await getForm<MyForm>(validData.uId, validData.fId);

  return res;
});
