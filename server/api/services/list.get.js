import { service } from "~/server/utils/service";

export default defineEventHandler(async (event) => {
  const serviceUtils = service();

  // Récupérer l'utilisateur connecté depuis la session
  const userSession = await getUserSession(event);
  const userId = userSession?.user?.id;

  try {
    // Récupérer tous les services sauf ceux de l'utilisateur connecté
    let services = await serviceUtils.getAllServices();
    if (userId) {
      services = services.filter((s) => s.user_id !== userId);
    }
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
