export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event);
  return "Hello Nitro";
});
