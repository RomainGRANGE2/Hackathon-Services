import { service } from '~/server/utils/service.js'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const searchTerm = query.q || ''

    // Récupérer l'utilisateur connecté
    const userSession = await getUserSession(event)
    const userId = userSession?.user?.id

    // Récupérer les services (tous si pas connecté, sinon exclure les siens)
    const serviceUtils = service()
    const allServices = userId 
      ? await serviceUtils.getServicesExcludingUser(userId)
      : await serviceUtils.getAllServices()
    
    if (!allServices || allServices.length === 0) {
      return {
        success: true,
        services: []
      }
    }

    // Si pas de terme de recherche, retourner tous les services (sauf les siens)
    if (!searchTerm.trim()) {
      return {
        success: true,
        services: allServices
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

    // Utiliser l'IA pour filtrer intelligemment les services
    const relevantServiceIds = await filterServicesWithAI(searchTerm, servicesForAI)
    
    // Récupérer les services complets correspondants
    const filteredServices = allServices.filter(service => 
      relevantServiceIds.includes(service.id)
    )

    return {
      success: true,
      services: filteredServices,
      searchTerm: searchTerm
    }

  } catch (error) {
    console.error('Erreur lors de la recherche simple:', error)
    return {
      success: false,
      error: 'Erreur lors de la recherche des services'
    }
  }
})

// Fonction pour filtrer les services avec l'IA Mistral
async function filterServicesWithAI(searchQuery, services) {
  try {
    const prompt = `
Tu es un assistant qui aide à filtrer des services digitaux selon une recherche utilisateur.
L'utilisateur recherche des services spécifiques avec des mots-clés ou une phrase courte ou un projet.

Requête de recherche: "${searchQuery}"

Services disponibles:
${services.map(service => `
ID: ${service.id}
Titre: ${service.title}
Description: ${service.description}
Tags: ${service.tag}
Catégorie: ${service.category}
Prix: ${service.price}€
---`).join('\n')}

Analyse la requête et retourne UNIQUEMENT les IDs des services qui correspondent le mieux à cette recherche.
Sois intelligent dans le matching : comprends les synonymes, les concepts proches, etc.

Exemples :
- "React" devrait matcher des services mentionnant React, frontend, JavaScript, développement web
- "design" devrait matcher UX, UI, graphisme, interface
- "API" devrait matcher backend, développement, intégration, services web

Retourne UNIQUEMENT un objet JSON avec cette structure exacte :
{"serviceIds": [1, 3, 5]}

Si aucun service ne correspond, retourne: {"serviceIds": []}
`

    // Utilisation de Mistral AI
    const response = await $fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: {
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 300,
        response_format: { type: 'json_object' }
      }
    })

    const aiResponse = response.choices[0].message.content.trim()
    
    try {
      const responseData = JSON.parse(aiResponse)
      return responseData.serviceIds || []
    } catch (parseError) {
      console.error('Erreur parsing réponse IA:', parseError)
      console.log('Réponse brute de Mistral:', aiResponse)
      // Fallback: recherche simple par mots-clés
      return simpleKeywordSearch(searchQuery, services)
    }

  } catch (error) {
    console.error('Erreur API Mistral:', error)
    // Fallback: recherche simple par mots-clés
    return simpleKeywordSearch(searchQuery, services)
  }
}

// Fonction de fallback pour recherche simple par mots-clés
function simpleKeywordSearch(query, services) {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
  
  const matchingServices = services.filter(service => {
    const searchableText = `
      ${service.title || ''} 
      ${service.description || ''} 
      ${service.tag || ''} 
      ${service.category || ''}
    `.toLowerCase()
    
    // Le service correspond si au moins un terme de recherche est trouvé
    return searchTerms.some(term => searchableText.includes(term))
  })

  return matchingServices.map(service => service.id)
}
