import { z } from "zod";
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

  // Create Form
  const da = await createForm<MyForm>(
    validData.uId,
    validData.form.fId,
    validData.form
  );

  if (da) {
    return {
      statusCode: 200,
      message: "Form created successfully",
    };
  } else {
    throw createError({
      statusCode: 500,
      message: "Failed to create form",
    });
  }
});
