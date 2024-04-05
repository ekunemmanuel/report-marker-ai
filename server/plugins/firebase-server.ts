import { initializeApp, getApps, cert } from "firebase-admin/app";
export default defineNitroPlugin((nitroApp) => {
  const apps = getApps();
  const { privateKey, projectId, clientEmail } = useRuntimeConfig();

  if (!apps.length) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });
  }
});

// clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
// projectId: process.env.FIREBASE_PROJECT_ID,
// privateKey: process.env.FIREBASE_PRIVATE_KEY,
