import { service } from '~/server/utils/service';

export default defineEventHandler(async (event) => {
  try {
    const session = await useSession(event);
    const userId = session?.data?.userId;

    if (!userId) {
      return {
        success: false,
        error: 'Non autorisé - vous devez être connecté',
      };
    }

    const serviceUtils = service();
    const userServices = await serviceUtils.getServicesByUserId(userId);

    return {
      success: true,
      services: userServices,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});
