import { z } from "zod";
import { createProfile } from "../../../utils/database";
export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.safeParse);
  if (!body.success) {
    return body.error.errors.map((e) => e);
  }
  const validData = body.data;

  const res = await createProfile(validData.uId, validData);
  return res;
});

const schema = z.object({
  uId: z.string(),
  email: z.string().email("Invalid email address"),
  name: z.string().nullish().optional(),
  photoURL: z.string().nullable().optional(),
});
