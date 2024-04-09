// To get all responses for a form with formId 1 and userId 1 make a GET request to /api/v1/users/1/forms/1/responses/

import { z } from "zod";
import { Response } from "~/server/models/response.model";
import { findUserById, findFormById } from "~/server/utils/dbUtils";
import { FormResponse } from "~/types";

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
  await findFormById(validData.fId);

  const response = (await Response.find({ fId: validData.fId })).toSorted(
    (a, b) => ((a.createdAt ?? 0) > (b.createdAt ?? 0) ? -1 : 1)
  );

  if (!response) {
    throw createError({
      statusCode: 404,
      message: "Response not found",
    });
  }

  return response as FormResponse[];
});
