export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();

  // Si l'utilisateur n'est pas connecté et n'est pas déjà sur la page d'auth
  if (!loggedIn.value && to.name !== "auth") {
    return navigateTo("/auth");
  }

  // Si l'utilisateur est connecté et tente d'accéder à la page d'auth, rediriger vers l'accueil
  if (loggedIn.value && to.name === "auth") {
    return navigateTo("/");
  }
});
