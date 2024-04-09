import { Response } from "../models/response.model";
import { Form } from "../models/form.model";
import { User } from "../models/user.model";

async function findUserById(uId: string) {
  const user = await User.findById(uId);
  if (!user) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }
  const data = user.toObject();
  delete (data as { password?: string }).password;
  return data;
}

async function findFormById(fId: string) {
  const form = await Form.findById(fId);
  if (!form) {
    throw createError({
      statusCode: 404,
      message: "Form not found",
    });
  }
  return form;
}

async function findResponseById(rId: string) {
  const response = await Response.findById(rId);
  if (!response) {
    throw createError({
      statusCode: 404,
      message: "Response not found",
    });
  }
  return response;
}

export { findUserById, findFormById, findResponseById };
