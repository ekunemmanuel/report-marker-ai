// To post a response to the server, we need to send a POST request to the server with the response data, form ID, and user ID as parameters. The server will then create the response and return a success message. The client will then display the success message to the user.

import { z } from "zod";
import { Form } from "~/server/models/form.model";
import { Response } from "~/server/models/response.model";
import { User } from "~/server/models/user.model";
import { findFormById, findUserById } from "~/server/utils/dbUtils";

const questionSchema = z
  .object({
    qId: z.string(),
    question: z.string(),
    required: z.boolean(),
    type: z.enum(["text", "single", "multiple"]),
    answer: z.union([z.string(), z.array(z.string())]).optional(),
    options: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "text") {
        return true;
      }
      return Array.isArray(data.options) && data.options.length > 0;
    },
    {
      message: "Options are required for single or multiple choice questions",
      path: ["options"],
    }
  )
  .refine((data) => (data.required ? data.answer !== undefined : true), {
    message: "Required questions must have an answer",
    path: ["answer"],
  });

const formSchema = z.object({
  fId: z.string(),
  title: z.string(),
  description: z.string(),
  questions: z.array(questionSchema),
  rId: z.string(),
});

const bodySchema = z.object({
  form: formSchema,
});

const paramsSchema = z.object({
  fId: z.string(),
  uId: z.string(),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, paramsSchema.safeParse);
  if (!params.success) {
    throw params.error.formErrors.fieldErrors;
  }
  const body = await readValidatedBody(event, bodySchema.safeParse);
  if (!body.success) {
    throw body.error.formErrors.fieldErrors;
  }
  const paramsData = params.data;
  const validData = body.data;

  await findUserById(paramsData.uId);
  await findFormById(paramsData.fId);

  const response = await Response.create({
    fId: validData.form.fId,
    uId: paramsData.uId,
    title: validData.form.title,
    description: validData.form.description,
    questions: validData.form.questions,
    rId: validData.form.rId,
  });

  if (!response) {
    throw createError({
      statusCode: 404,
      message: "Response not found",
    });
  }

  return {
    statusCode: 200,
    message: "Submitted successfully",
  };
});
