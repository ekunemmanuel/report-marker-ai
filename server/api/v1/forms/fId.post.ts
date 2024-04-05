import { z } from "zod";
import { getForms } from "~/server/utils/database";
import { MyForm } from "~/types";

const inputSchema = z.object({
  uId: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, inputSchema.safeParse);
  if (!body.success) {
    throw body.error.formErrors.fieldErrors;
  }
  const validData = body.data;

  const res = await getForms(validData.uId);

  return res as MyForm[];
});
