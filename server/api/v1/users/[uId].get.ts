import { User } from "~/types";
import { z } from "zod";

const user = z.object({
  uId: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, user.safeParse);
  if (!params.success) {
    throw params.error.formErrors.fieldErrors;
  }
  const data = await getProfile<User>(params.data.uId);

  // Echo back request as response
  return data;
});
