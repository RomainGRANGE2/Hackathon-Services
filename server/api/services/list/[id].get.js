import { service } from '~/server/utils/service'

export default defineEventHandler(async (event) => {
  const serviceUtils = service()
  const { id } = event.context.params
  const user = event.context?.auth?.user

  try {
    const foundService = await serviceUtils.getServiceById(id)
    if (!foundService) {
      return {
        success: false,
        message: 'Service non trouvé'
      }
    }
    let isOwner = false
    if (user && user.id && foundService.user_id == user.id) {
      isOwner = true
    }
    return {
      success: true,
      service: foundService,
      isOwner
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
})

