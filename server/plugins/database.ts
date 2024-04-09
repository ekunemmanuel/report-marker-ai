import mongoose from "mongoose";

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig();

  // emmanuelapabiekun h9eZEavQACsUAEKL

  mongoose.connect(
    process.dev ? config.mongodbTestUri : config.mongodbLiveUri,
    {}
  );
  console.log("Connected to MongoDB!");
});