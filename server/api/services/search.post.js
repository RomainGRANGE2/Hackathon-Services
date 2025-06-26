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

    // Appeler l'IA pour décomposer le projet et trouver les services
    const projectAnalysis = await analyzeProjectWithAI(query, servicesForAI)
    
    return {
      success: true,
      projectAnalysis,
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

// Fonction pour analyser le projet et trouver les services correspondants
async function analyzeProjectWithAI(projectPitch, services) {
  try {
    const prompt = `
Tu es un expert en gestion de projet digital. L'utilisateur te décrit son projet et tu dois :

1. Décomposer son projet en grandes étapes/tâches nécessaires
2. Pour chaque étape, trouver le service le plus pertinent dans notre base de données
3. Si aucun service ne correspond à une étape, indiquer qu'aucun service n'est disponible

Pitch du projet: "${projectPitch}"

Services disponibles:
${services.map(service => `
ID: ${service.id}
Titre: ${service.title}
Description: ${service.description}
Tags: ${service.tag}
Catégorie: ${service.category}
Prix: ${service.price}€
---`).join('\n')}

Retourne UNIQUEMENT un objet JSON avec cette structure exacte :
{
  "projectTitle": "Titre généré pour le projet",
  "projectSummary": "Résumé du projet en 1-2 phrases",
  "tasks": [
    {
      "title": "Nom de la tâche/étape",
      "description": "Description de ce qui est nécessaire pour cette étape",
      "recommendedService": {
        "id": 123,
        "title": "Titre du service",
        "description": "Description du service",
        "price": 500,
        "matchReason": "Pourquoi ce service correspond à cette tâche"
      }
    },
    {
      "title": "Autre tâche",
      "description": "Description de cette étape",
      "recommendedService": null
    }
  ]
}

Si aucun service ne correspond à une tâche, mets "recommendedService": null
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
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      }
    })

    const aiResponse = response.choices[0].message.content.trim()
    
    try {
      const projectAnalysis = JSON.parse(aiResponse)
      
      // Enrichir les services recommandés avec les données complètes
      if (projectAnalysis.tasks) {
        projectAnalysis.tasks = projectAnalysis.tasks.map(task => {
          if (task.recommendedService && task.recommendedService.id) {
            const fullService = services.find(s => s.id === task.recommendedService.id)
            if (fullService) {
              task.recommendedService = {
                ...fullService,
                matchReason: task.recommendedService.matchReason
              }
            }
          }
          return task
        })
      }
      
      return projectAnalysis
    } catch (parseError) {
      console.error('Erreur parsing réponse IA:', parseError)
      console.log('Réponse brute de Mistral:', aiResponse)
      
      // Fallback: analyse simple
      return {
        projectTitle: "Analyse du projet",
        projectSummary: "Projet analysé automatiquement",
        tasks: [
          {
            title: "Développement global",
            description: "Développement complet du projet",
            recommendedService: services.length > 0 ? services[0] : null
          }
        ]
      }
    }

  } catch (error) {
    console.error('Erreur API Mistral:', error)
    
    // Fallback: analyse simple
    return {
      projectTitle: "Analyse du projet",
      projectSummary: "Projet analysé automatiquement",
      tasks: [
        {
          title: "Développement global", 
          description: "Développement complet du projet",
          recommendedService: services.length > 0 ? services[0] : null
        }
      ]
    }
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
