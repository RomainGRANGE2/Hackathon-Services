import { query } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { serviceId, userId } = body

    if (!serviceId || !userId) {
      return {
        success: false,
        error: 'ServiceId et UserId requis'
      }
    }

    // Vérifier si une conversation existe déjà pour ce service et cet utilisateur
    let conversation = await query(
      'SELECT * FROM ai_conversations WHERE service_id = $1 AND user_id = $2 ORDER BY created_at DESC LIMIT 1',
      [serviceId, userId]
    )

    if (conversation.rows.length > 0) {
      // Conversation existante trouvée
      conversation = conversation.rows[0]
      
      // Parser les messages JSON
      if (conversation.messages && typeof conversation.messages === 'string') {
        conversation.messages = JSON.parse(conversation.messages)
      }
    } else {
      // Créer une nouvelle conversation
      const sessionId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const newConversation = await query(
        'INSERT INTO ai_conversations (service_id, user_id, session_id, messages) VALUES ($1, $2, $3, $4) RETURNING *',
        [serviceId, userId, sessionId, JSON.stringify([])]
      )
      
      conversation = newConversation.rows[0]
      conversation.messages = []
    }

    return {
      success: true,
      conversation
    }

  } catch (error) {
    console.error('Erreur conversation:', error)
    return {
      success: false,
      error: 'Erreur lors de la gestion de la conversation'
    }
  }
})
