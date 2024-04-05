import { User } from "~/types";
import { z } from "zod";

const user = z.object({
  uId: z.string().min(1),
});
export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, user.parse);
  console.log("params", params);

  // Echo back request as response
  const eventStream = createEventStream(event);

  // Send a message every second
  const interval = setInterval(async () => {
    const data = await getProfile<User>(params.uId);
    await eventStream.push(JSON.stringify(data));
  }, 1000);

  // cleanup the interval and close the stream when the connection is terminated
  eventStream.onClosed(async () => {
    console.log("closing SSE...");
    clearInterval(interval);
    await eventStream.close();
  });

  return eventStream.send();
});
