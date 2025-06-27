import { service } from '~/server/utils/service'
const { createService } = service();



export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validation des champs obligatoires
    if (!body.title || !body.description || body.price === null) {
      return { success: false, error: 'Champs obligatoires manquants' }
    }

    // Vérifier l'authentification pour les utilisateurs
    const session = await getUserSession(event)
    const userId = session?.user?.id
    if (!userId) {
      return { success: false, error: 'Non autorisé' }
    }

    // Forcer le service à être de type "human" pour les utilisateurs
    body.service_type = 'human'
    body.ai_config = null

    await createService(body, userId)

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
