// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@vueuse/nuxt", "@sidebase/nuxt-auth"],
  runtimeConfig: {
    authJs: {
      secret: process.env.NUXT_NEXTAUTH_SECRET,
    },
    clientEmail: process.env.NUXT_CLIENT_EMAIL,
    projectId: process.env.NUXT_PROJECT_ID,
    privateKey: process.env.NUXT_PRIVATE_KEY,
    paymentApiUrl: process.env.NUXT_PAYSTACKURL,
    paymentTestSecretKey: process.env.NUXT_PAYSTACK_TEST_SECRET_KEY,
    paymentLiveSecretKey: process.env.NUXT_PAYSTACK_LIVE_SECRET_KEY,
    mongodbTestUri: process.env.NUXT_MONGODB_TEST_URI,
    mongodbLiveUri: process.env.NUXT_MONGODB_lIVE_URI,
    googleId: process.env.NUXT_GOOGLE_ID,
    googleSecret: process.env.NUXT_GOOGLE_SECRET,
    app: {
      apiKey: process.env.NUXT_API_KEY,
      authDomain: process.env.NUXT_AUTH_DOMAIN,
      projectId: process.env.NUXT_PROJECT_ID,
      storageBucket: process.env.NUXT_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_APP_ID,
      measurementId: process.env.NUXT_MEASUREMENT_ID,
    },
  },

  auth: {
    baseURL:process.dev? process.env.NUXT_BASE_TEST_URL : process.env.NUXT_AUTH_ORIGIN_NEW_FEATURE,
    provider: {
      type: "authjs",
      
    },
    globalAppMiddleware: true,
  },
});
