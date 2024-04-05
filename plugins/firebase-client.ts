// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Initialize Firebase
export default defineNuxtPlugin(() => {
  const { app: firebaseConfig } = useRuntimeConfig();
  const app = initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
    measurementId: firebaseConfig.measurementId,
  });


 

  

  return {
    provide: {
      firebaseApp: app,
    },
  };
});
