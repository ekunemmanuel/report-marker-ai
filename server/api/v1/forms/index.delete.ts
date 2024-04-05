import { z } from "zod";

const inputSchema = z.object({
  fId: z.string(),
  uId: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, inputSchema.safeParse);

  if (!body.success) {
    throw body.error.formErrors.fieldErrors;
  }
  const validData = body.data;

  // delete Form
  const data = await deleteForm(validData.uId, validData.fId);

  if (data.status) {
    return {
      statusCode: 200,
      message: "Form created successfully",
    };
  }
  throw createError({
    statusCode: 500,
    message: "Failed to create form",
  });
});
