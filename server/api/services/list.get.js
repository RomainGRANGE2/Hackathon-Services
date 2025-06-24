import { service } from '~/server/utils/service'

export default defineEventHandler(async (event) => {
    const serviceUtils = service()

    try {
        const services = await serviceUtils.getAllServices()
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
