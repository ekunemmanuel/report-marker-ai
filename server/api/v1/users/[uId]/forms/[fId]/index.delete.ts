// To delete all responses and a form with formId 1 and userId 1 make a Delete request to /api/v1/users/1/forms/1/responses/

import { z } from "zod";
import { Form } from "~/server/models/form.model";
import { Response } from "~/server/models/response.model";
import { User } from "~/server/models/user.model";
import { findUserById } from "~/server/utils/dbUtils";

const inputSchema = z.object({
  uId: z.string(),
  fId: z.string(),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, inputSchema.safeParse);

  if (!params.success) {
    throw params.error.formErrors.fieldErrors;
  }
  const validData = params.data;

  await findUserById(validData.uId);

  const form = await Form.findByIdAndDelete(validData.fId);

  if (!form) {
    throw createError({
      statusCode: 404,
      message: "Form not found",
    });
  }

  const response = await Response.deleteMany({ fId: validData.fId });

  console.log(response.deletedCount);

  return {
    statusCode: 200,
    message: "Form deleted",
  };
});
