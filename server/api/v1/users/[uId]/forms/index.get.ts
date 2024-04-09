import { findUserById } from '~/server/utils/dbUtils';
// to get the user with id 1 and forms make a GET request to /api/v1/users/1/forms/

import { z } from "zod";
import { Form } from "~/server/models/form.model";
import { MyForm } from "~/types";

const inputSchema = z.object({
  uId: z.string(),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, inputSchema.safeParse);
  if (!params.success) {
    throw params.error.formErrors.fieldErrors;
  }
  const validData = params.data;

  await findUserById(validData.uId);

  const forms = (await Form.find({ uId: validData.uId })).toSorted((a, b) =>
    (a.createdAt ?? 0) > (b.createdAt ?? 0) ? -1 : 1
  );

  if (!forms) {
    throw createError({
      statusCode: 404,
      message: "forms not found",
    });
  }

  return forms as MyForm[];
});
