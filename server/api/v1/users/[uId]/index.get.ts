// to get the user with id 1, make a GET request to /api/v1/users/1

import { z } from "zod";
import { findUserById } from "~/server/utils/dbUtils";

const user = z.object({
  uId: z.string().min(1),
});
export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, user.safeParse);
  if (!params.success) {
    throw params.error.formErrors.fieldErrors;
  }

  // Echo back request as response
  const eventStream = createEventStream(event);

  // Send a message every second
  const interval = setInterval(async () => {
    const user = await findUserById(params.data.uId);
    await eventStream.push(JSON.stringify({ ...user }));
  }, 10000);

  // cleanup the interval and close the stream when the connection is terminated
  eventStream.onClosed(async () => {
    console.log("closing SSE...");
    clearInterval(interval);
    await eventStream.close();
  });

  return eventStream.send();
});
