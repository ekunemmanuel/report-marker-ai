//  to update a form on the server, we need to send a PUT request to the server with the user ID and form data as parameters. The server will then update the form data if it exists. If the form does not exist, the server will return an error message. The client will then display a success message if the form is updated successfully or an error message if the form is not updated successfully.

import { z } from "zod";
import { Form } from "~/server/models/form.model";
import { User } from "~/server/models/user.model";
import { findUserById } from "~/server/utils/dbUtils";
import { MyForm } from "~/types";

const questionSchema = z.object({
  qId: z.string(),
  question: z.string(),
  required: z.boolean(),
  type: z.union([
    z.literal("text"),
    z.literal("single"),
    z.literal("multiple"),
  ]),
  options: z.array(z.string()).optional(),
});

const formSchema = z.object({
  fId: z.string(),
  title: z.string(),
  description: z.string(),
  questions: z.array(questionSchema),
});

const inputSchema = z.object({
  form: formSchema,
  uId: z.string(),
});

const paramsSchema = z.object({
  uId: z.string(),
  fId: z.string(),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, paramsSchema.safeParse);

  if (!params.success) {
    throw params.error.formErrors.fieldErrors;
  }

  const body = await readValidatedBody(event, inputSchema.safeParse);

  if (!body.success) {
    throw body.error.errors.map((e) => e);
  }
  const validData = body.data;

  // Check if user exists
  await findUserById(validData.uId);
  // Create Form
  const form = await Form.findByIdAndUpdate(validData.form.fId, {
    title: validData.form.title,
    description: validData.form.description,
    questions: validData.form.questions,
  });

  if (!form) {
    throw createError({
      statusCode: 404,
      message: "Form not found",
    });
  }

  return form as MyForm;
});
