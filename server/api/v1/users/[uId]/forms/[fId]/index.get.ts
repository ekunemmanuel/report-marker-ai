// to get the user with id 1 and form with id 2, make a GET request to /api/v1/users/1/forms/2

import { z } from "zod";
import { Form } from "~/server/models/form.model";
import { User } from "~/server/models/user.model";
import { findFormById, findUserById } from "~/server/utils/dbUtils";
import { MyForm } from "~/types";

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

  // Check if user exists
  await findUserById(validData.uId);
  const form = await findFormById(validData.fId);

  // i want to wait for 2 seconds
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  return form as MyForm;
});
