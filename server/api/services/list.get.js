import { service } from '~/server/utils/service'

export default defineEventHandler(async (event) => {
    const serviceUtils = service()

    // Récupérer l'utilisateur connecté (supposé injecté par le middleware auth)
    const user = event.context?.auth?.user

    try {
        let services
        if (user && user.id) {
            services = await serviceUtils.getServicesByUserId(user.id)
        } else {
            services = await serviceUtils.getAllServices()
        }
        return {
            success: true,
            services
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
})
