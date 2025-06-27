export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { conversationId, message, serviceConfig } = body

    if (!conversationId || !message || !serviceConfig) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameters'
      })
    }

    // Process with Mistral AI based on service type
    let response = ''
    
    switch (serviceConfig.type) {
      case 'translation':
        response = await processTranslation(message.content, serviceConfig)
        break
      case 'summarization':
        response = await processSummarization(message.content, serviceConfig)
        break
      case 'correction':
        response = await processCorrection(message.content, serviceConfig)
        break
      default:
        response = await processGeneral(message.content, serviceConfig)
        break
    }

    return {
      success: true,
      response
    }
  } catch (error) {
    console.error('Erreur traitement AI:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erreur de traitement'
    })
  }
})

// Fonction utilitaire pour appeler Mistral AI
async function callMistralAI(prompt, userMessage) {
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu traiter votre demande.'
  } catch (error) {
    console.error('Erreur Mistral AI:', error)
    throw new Error('Erreur lors de la communication avec Mistral AI')
  }
}

async function processTranslation(text, config) {
  const prompt = `Tu es un expert en traduction multilingue. Ta tâche est de traduire le texte fourni par l'utilisateur.

Instructions :
- Si l'utilisateur précise une langue de destination, traduis vers cette langue
- Si aucune langue n'est précisée, détecte automatiquement la langue source et traduis vers le français si c'est de l'anglais, ou vers l'anglais si c'est du français
- Fournis une traduction naturelle et fluide
- Si le texte contient des expressions idiomatiques, adapte-les à la langue cible
- Réponds uniquement avec la traduction, sans explication supplémentaire sauf si demandé

Exemples de formats attendus :
- "Translate to Spanish: Hello world" → "Hola mundo"
- "Hello world" → "Bonjour le monde"
- "Bonjour le monde" → "Hello world"`

  return await callMistralAI(prompt, text)
}

async function processSummarization(text, config) {
  const prompt = `Tu es un expert en résumé de texte. Ta tâche est de créer des résumés clairs et concis.

Instructions :
- Analyse le texte fourni et crée un résumé qui capture les points essentiels
- Conserve les informations les plus importantes et pertinentes
- Le résumé doit être environ 3 fois plus court que le texte original
- Utilise un style clair et professionnel
- Structure le résumé en phrases complètes et cohérentes
- Si le texte est très court, fournis plutôt les points clés

Format de réponse :
Résumé : [ton résumé ici]

Points clés (si pertinent) :
- Point 1
- Point 2
- etc.`

  return await callMistralAI(prompt, text)
}

async function processCorrection(text, config) {
  const prompt = `Tu es un correcteur professionnel expert en français. Ta tâche est de corriger et améliorer les textes.

Instructions :
- Corrige toutes les erreurs d'orthographe, de grammaire et de syntaxe
- Améliore la ponctuation si nécessaire
- Assure-toi que le texte respecte les règles du français
- Conserve le sens et le style original du texte
- Si le texte contient des anglicismes, propose des alternatives françaises appropriées
- Signale les corrections importantes effectuées

Format de réponse :
Texte corrigé : [texte corrigé]

Principales corrections (si pertinent) :
- Correction 1
- Correction 2
- etc.`

  return await callMistralAI(prompt, text)
}

async function processGeneral(text, config) {
  const prompt = `Tu es un assistant IA polyvalent et bienveillant. Tu peux aider sur une grande variété de sujets.

Instructions :
- Réponds de manière utile et précise aux questions
- Sois poli et professionnel dans tes réponses
- Si tu ne connais pas la réponse, dis-le honnêtement
- Propose des suggestions ou des pistes de réflexion quand approprié
- Adapte ton niveau de langage à la question posée
- Sois concis mais complet dans tes explications

Tu peux aider avec :
- Questions générales
- Conseils et suggestions
- Explications de concepts
- Résolution de problèmes
- Et bien d'autres sujets`

  return await callMistralAI(prompt, text)
}