import { waitlistSchema } from "~/schema";
import { Waitlist } from "~/server/models/waitlist.model";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, waitlistSchema.safeParse);
  if (!body.success) {
    throw body.error.formErrors.fieldErrors;
  }

  // Save to database
  const waitlist = await Waitlist.create(body.data);
  if (!waitlist) {
    return createError({
      status: 404,
      message: "Internal Server Error",
    });
  }
  return {
    status: 201,
    body: "Joined the waitlist!",
  };
});
