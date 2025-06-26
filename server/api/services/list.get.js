import { service } from "~/server/utils/service";

export default defineEventHandler(async (event) => {
  const serviceUtils = service();

  // Récupérer l'utilisateur connecté depuis la session
  const userSession = await getUserSession(event);
  const userId = userSession?.user?.id;

  try {
    // Récupérer tous les services sauf ceux de l'utilisateur connecté
    const services = userId 
      ? await serviceUtils.getServicesExcludingUser(userId)
      : await serviceUtils.getAllServices();
      
    return {
      success: true,
      services,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
});
