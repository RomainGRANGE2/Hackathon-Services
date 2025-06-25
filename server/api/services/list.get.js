import { service } from '~/server/utils/service';

export default defineEventHandler(async (event) => {
  const serviceUtils = service();

  try {
    // Retourner tous les services, le filtrage se fait côté client selon la page
    const services = await serviceUtils.getAllServices();
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
