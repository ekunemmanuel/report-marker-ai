// To post a form to the server, we need to send a POST request to the server with the form data and user ID as parameters. The server will then create the form and return the form data. The client will then display the form data to the user.

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

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, inputSchema.safeParse);

  if (!body.success) {
    throw body.error.errors.map((e) => e);
  }
  const validData = body.data;

  // Check if user exists
  await findUserById(validData.uId);

  // Create Form
  const form = (
    await Form.create({
      fId: validData.form.fId,
      title: validData.form.title,
      description: validData.form.description,
      questions: validData.form.questions,
      uId: validData.uId,
    })
  ).toObject();

  return form as MyForm;
});
