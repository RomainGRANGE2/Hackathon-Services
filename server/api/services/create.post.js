import { service } from '~/server/utils/service'
const { createService } = service();



export default defineEventHandler(async (event) => {
  try {

    const session = await getUserSession(event)
    const userId = session?.user?.id
    if (!userId) {
      return { success: false, error: 'Non autorisé' }
    }
    const body = await readBody(event)
    if (!body.title || !body.description || body.price === null) {
      return { success: false, error: 'Champs obligatoires manquants' }
    }

    await createService(body,userId)


    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
