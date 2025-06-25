import { service } from '~/server/utils/service.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { query } = body

    if (!query || query.trim() === '') {
      return {
        success: false,
        error: 'Requête de recherche manquante'
      }
    }

    // Récupérer tous les services
    const serviceUtils = service()
    const allServices = await serviceUtils.getAllServices()
    
    if (!allServices || allServices.length === 0) {
      return {
        success: true,
        services: []
      }
    }

    // Préparer les données pour l'IA
    const servicesForAI = allServices.map(service => ({
      id: service.id,
      title: service.title || '',
      description: service.description || '',
      tag: service.tag || '',
      category: service.category || '',
      price: service.price || 0
    }))

    // Appeler l'IA pour filtrer les services
    const relevantServices = await filterServicesWithAI(query, servicesForAI)
    
    // Récupérer les services complets correspondants
    const filteredServices = allServices.filter(service => 
      relevantServices.some(relevant => relevant.id === service.id)
    )

    return {
      success: true,
      services: filteredServices,
      searchQuery: query
    }

  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    return {
      success: false,
      error: 'Erreur lors de la recherche des services'
    }
  }
})

// Fonction pour filtrer les services avec l'IA
async function filterServicesWithAI(query, services) {
  try {
    const prompt = `
Tu es un assistant qui aide à filtrer des services digitaux selon une recherche utilisateur.
Analyse la requête et retourne uniquement les services qui correspondent le mieux à cette recherche.

Requête de recherche: "${query}"

Services disponibles:
${services.map(service => `
ID: ${service.id}
Titre: ${service.title}
Description: ${service.description}
Tags: ${service.tag}
Catégorie: ${service.category}
Prix: ${service.price}€
---`).join('\n')}

Retourne UNIQUEMENT un objet JSON avec une propriété "services" contenant un tableau des IDs pertinents.
Format exact attendu: {"services": [{"id": 1}, {"id": 3}, {"id": 5}]}
`

    // Utilisation de Mistral AI
    const response = await $fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: {
        model: 'mistral-small-latest', // ou 'mistral-tiny' pour plus rapide et moins cher
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      }
    })

    const aiResponse = response.choices[0].message.content.trim()
    
    // Parser la réponse JSON de l'IA
    try {
      const responseData = JSON.parse(aiResponse)
      const relevantServices = responseData.services || responseData
      return Array.isArray(relevantServices) ? relevantServices : []
    } catch (parseError) {
      console.error('Erreur parsing réponse IA:', parseError)
      console.log('Réponse brute de Mistral:', aiResponse)
      // Fallback: recherche simple par mots-clés
      return simpleKeywordSearch(query, services)
    }

  } catch (error) {
    console.error('Erreur API Mistral:', error)
    // Fallback: recherche simple par mots-clés
    return simpleKeywordSearch(query, services)
  }
}

// Fonction de fallback pour recherche simple
function simpleKeywordSearch(query, services) {
  const searchTerms = query.toLowerCase().split(' ')
  
  return services.filter(service => {
    const searchableText = `
      ${service.title} 
      ${service.description} 
      ${service.tag} 
      ${service.category}
    `.toLowerCase()
    
    return searchTerms.some(term => searchableText.includes(term))
  }).map(service => ({ id: service.id }))
}
