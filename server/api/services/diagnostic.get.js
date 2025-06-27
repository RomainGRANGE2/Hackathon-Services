// Test simple de connectivité DB
import { service } from "~/server/utils/service"

export default defineEventHandler(async (event) => {
  try {
    console.log('🔍 [DIAGNOSTIC] Test de connectivité DB...')
    
    const serviceUtils = service()
    const allServices = await serviceUtils.getAllServices()
    
    console.log('🔍 [DIAGNOSTIC] Services trouvés:', allServices?.length)
    
    return {
      success: true,
      count: allServices?.length || 0,
      services: allServices?.slice(0, 2).map(s => ({
        id: s.id,
        title: s.title,
        service_type: s.service_type
      })) || []
    }

  } catch (error) {
    console.error('🔍 [DIAGNOSTIC] Erreur:', error)
    return {
      success: false,
      error: error.message
    }
  }
})
