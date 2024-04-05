import { getAuth, onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = getAuth();
  const user = useUser();
  const { getProfile } = useApiCalls();

  // List of public routes
  const publicRoutes = ["/", "/login", "/register"];

  // Check if the route is public
  const isPublicRoute = publicRoutes.includes(to.path);
  console.log(from);

  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      console.log("User is signed in");
      // Handle signed-   in user logic here
      user.value = {
        uId: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || "",
        photoURL: firebaseUser.photoURL || "",
      };
      console.log(user.value);

      // If the user is logged in and trying to access the login or register page, redirect them to the dashboard
      if (
        to.path === "/login" ||
        to.path === "/register" ||
        from.path === "/login" ||
        from.path === "/register"
      ) {
        return navigateTo("/dashboard/forms");
      }
    } else {
      console.log("User is signed out");
      // If the user is not logged in and the route is not public, redirect to the login page
      user.value = null;
      if (!isPublicRoute) {
        return navigateTo("/login");
      }
    }
  });
});
