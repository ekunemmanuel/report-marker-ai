import { z } from "zod";
import { FormResponse, MyForm } from "~/types";

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
});

const inputSchema = z.object({
  form: formSchema,
  rId: z.string(),
  uId: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, inputSchema.safeParse);

  if (!body.success) {
    // Handle validation errors
    throw body.error.formErrors.fieldErrors;
  } else {
    // Input is valid
    const validData = body.data;

    // Create response
    const da = await createResponse<FormResponse>(
      validData.uId,
      validData.form.fId,
      validData.rId,
      {
        ...validData.form,
        rId: validData.rId,
      }
    );

    if (da) {
      return {
        statusCode: 200,
        message: "Form submetted successfully",
      };
    }
    throw createError({
      statusCode: 500,
      message: "Failed to submit form",
    });
  }
});
