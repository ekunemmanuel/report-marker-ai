import { FirebaseError } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  type User,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

export const useMyFirebase = () => {
  const auth = getAuth();
  const user = useUser();
  const { notification } = useNotification();
  const { getProfile } = useApiCalls();

  async function register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const data = {
        email: userCredential.user.email ?? "",
        name: userCredential.user.displayName ?? "",
        photoURL: userCredential.user.photoURL ?? "",
        uId: userCredential.user.uid,
      };
      await createUserDetails(data);

      user.value = {
        email: userCredential.user.email ?? "",
        name: userCredential.user.displayName ?? "",
        photoURL: userCredential.user.photoURL ?? "",
        uId: userCredential.user.uid,
        subscription: "inactive",
      };
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        notification("Error", firebaseError(error.code), "firebase-error");
        return;
      }

      notification("Error", error, "error");
    }
  }

  async function login(email: string, password: string) {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      user.value = {
        email: userCredential.user.email ?? "",
        name: userCredential.user.displayName ?? "",
        photoURL: userCredential.user.photoURL ?? "",
        uId: userCredential.user.uid,
      };
      return navigateTo("/dashboard");
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        notification("Error", firebaseError(error.code), "firebase-error");
        return;
      }

      notification("Error", error, "error");
    }
  }

  async function logout() {
    await auth.signOut();
    user.value = null;
    navigateTo("/login");
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);

      notification(
        "Reset Password",
        "Password reset email sent.",
        "reset-password"
      );
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        notification("Error", firebaseError(error.code), "firebase-error");
        return;
      }

      notification("Error", error, "error");
    }
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const data = {
        email: userCredential.user.email ?? "",
        name: userCredential.user.displayName ?? "",
        photoURL: userCredential.user.photoURL ?? "",
        uId: userCredential.user.uid,
      };
      await createUserDetails(data);

      user.value = {
        email: userCredential.user.email ?? "",
        name: userCredential.user.displayName ?? "",
        photoURL: userCredential.user.photoURL ?? "",
        uId: userCredential.user.uid,
        subscription: "inactive",
      };
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        notification("Error", firebaseError(error.code), "firebase-error");
        return;
      }

      notification("Error", error, "error");
    }
  }

  async function logInWithGoogle() {
    await setPersistence(auth, browserSessionPersistence);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);

      const data = await getProfile(userCredential.user.uid);

      if (!data) {
        throw new Error("User not found. Please register.");
      }
      user.value = {
        email: data.email,
        name: data.name,
        photoURL: data.photoURL,
        uId: data.uId,
        subscription: data.subscription,
      };
      return navigateTo("/dashboard");
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        notification("Error", firebaseError(error.code), "firebase-error");
        return;
      }

      notification("Error", error, "error");
    }
  }

  async function createUserDetails(data: {}) {
    try {
      const result = await $fetch("/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      console.log(result);

      navigateTo("/login");
    } catch (error: any) {
      if (`"/api/v1/users": 409 Conflict`) {
        notification("Error", "User already exists!", "error");
        return;
      }

      notification("Error", "An error occurred. Please try again.", "error");
    }
  }

  return {
    register,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    logInWithGoogle,
  };
};

export function firebaseError(code: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "The email address is already in use by another account.";
    case "auth/invalid-email":
      return "The email address is not valid.";
    case "auth/invalid-credential":
      return "Wrong credentials. Please try again. or Try resetting your password.";
    case "auth/weak-password":
      return "The password is too weak.";
    case "auth/user-not-found":
      return "There is no user record corresponding to this identifier.";
    case "auth/wrong-password":
      return "The password is invalid.";
    case "auth/too-many-requests":
      return "Too many requests. Try again later.";
    case "auth/popup-closed-by-user":
      return "The popup has been closed by the user before finalizing the operation.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.";
    case "auth/cancelled-popup-request":
      return "This operation has been cancelled due to another conflicting popup being opened.";
    case "auth/popup-blocked":
      return "The operation has been cancelled due to a conflicting popup.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.";
    default:
      return "An error occurred. Please try again.";
  }
}
