import { service } from '~/server/utils/service'

export default defineEventHandler(async (event) => {
  const serviceUtils = service()
  const { id } = event.context.params
  const session = await getUserSession(event)

  const userIdSession = session?.user?.id

  try {
    const foundService = await serviceUtils.getServiceById(id)
    const userId = foundService.user_id
    if (!foundService) {
      return {
        success: false,
        message: 'Service non trouvé'
      }
    }
    let isOwner = false
    if (userId && userId === userIdSession) {
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

