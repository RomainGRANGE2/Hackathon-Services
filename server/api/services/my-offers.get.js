import { service } from '~/server/utils/service';

export default defineEventHandler(async (event) => {
  try {
    const session = await useSession(event);
    console.log('Session complète:', session);
    console.log('Session data:', session?.data);
    
    const userId = session?.data?.userId;
    console.log('UserID extrait de la session:', userId);

    if (!userId) {
      console.log('Aucun userId trouvé dans la session');
      return {
        success: false,
        error: 'Non autorisé - vous devez être connecté',
      };
    }

    const serviceUtils = service();
    const userServices = await serviceUtils.getServicesByUserId(userId);
    console.log('Services trouvés pour l\'utilisateur', userId, ':', userServices);

    return {
      success: true,
      services: userServices,
    };
  } catch (error) {
    console.error('Erreur dans my-offers.get.js:', error);
    return {
      success: false,
      error: error.message,
    };
  }
});
