// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@vueuse/nuxt"],
  ssr: !false,
  runtimeConfig: {
    clientEmail: process.env.NUXT_CLIENTEMAIL,
    projectId: process.env.NUXT_PROJECTID,
    privateKey: process.env.NUXT_PRIVATEKEY,
    paymentApiUrl: process.env.NUXT_PAYSTACKURL,
    paymentTestSecretKey: process.env.NUXT_PAYSTACKTESTSECRETKEY,
    paymentLiveSecretKey: process.env.NUXT_PAYSTACKLIVESECRETKEY,
    app: {
      apiKey: process.env.NUXT_APIKEY,
      authDomain: process.env.NUXT_AUTHDOMAIN,
      projectId: process.env.NUXT_PROJECTID,
      storageBucket: process.env.NUXT_STORAGEBUCKET,
      messagingSenderId: process.env.NUXT_MESSAGINGSENDERID,
      appId: process.env.NUXT_APPID,
      measurementId: process.env.NUXT_MEASUREMENTID,
    },
  },

  nitro: {
    experimental: {
      websocket: true,
    },
  },
});
