// To get a response by its ID from the server, we need to send a GET request to the server with the user ID, form ID, and response ID as parameters. The server will then return the response data if it exists. If the response does not exist, the server will return an error message. The client will then display the response data to the user if it exists or display an error message if it does not exist.

// Path: server/api/v1/users/%5BuId%5D/forms/%5BfId%5D/responses/%5BrId%5D/index.get.ts

import { z } from "zod";
import {
  findFormById,
  findResponseById,
  findUserById,
} from "~/server/utils/dbUtils";
import { FormResponse } from "~/types";

const inputSchema = z.object({
  uId: z.string(),
  fId: z.string(),
  rId: z.string(),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, inputSchema.safeParse);

  if (!params.success) {
    throw params.error.formErrors.fieldErrors;
  }
  const validData = params.data;

  await findUserById(validData.uId);
  await findFormById(validData.fId);

  const response = await findResponseById(validData.rId);

  return response as FormResponse;
});
