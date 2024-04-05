import { getResponses } from "~/server/utils/database";
import { z } from "zod";
import { FormResponse } from "~/types";

const schema = z.object({
  uId: z.string(),
  fId: z.string(),
});
export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.safeParse);
  if (!body.success) {
    throw body.error.formErrors.fieldErrors;
  }
  const data = await getResponses(body.data.uId, body.data.fId);

  return data as FormResponse[];
});
