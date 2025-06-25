import { service } from '~/server/utils/service'

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event)
    const userId = session?.user?.id
    if (!userId) {
      return { success: false, error: 'Non autorisé' }
    }
    const body = await readBody(event)
    if (!body.id) {
      return { success: false, error: 'ID manquant' }
    }
    const serviceUtils = service()
    const updated = await serviceUtils.updateService(body.id, body, userId)
    return { success: true, service: updated }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
