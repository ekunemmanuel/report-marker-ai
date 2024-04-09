import { z } from "zod";
import { User, UserDocument } from "~/server/models/user.model";
import { genSalt, hash } from "bcrypt";
import { findUserById } from "~/server/utils/dbUtils";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.safeParse);
  if (!body.success) {
    throw body.error.formErrors.fieldErrors;
  }
  const validData = body.data;

  const salt = await genSalt(10);
  const hashedPassword = await hash(validData.password, salt);

  const existingUser = await User.findOne({ email: validData.email });
  if (existingUser) {
    throw createError({
      status: 400,
      message: "User with this email already exists",
    });
  }

  await User.create({ ...validData, password: hashedPassword });

  return {
    status: 200,
    message: "User created successfully",
  };
});

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 character long"),
});
