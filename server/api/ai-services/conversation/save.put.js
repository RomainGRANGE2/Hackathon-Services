import { query } from '../../../utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { conversationId, messages } = body

    if (!conversationId || !messages) {
      return {
        success: false,
        error: 'ConversationId et messages requis'
      }
    }

    // Mettre à jour la conversation avec les nouveaux messages
    await query(
      'UPDATE ai_conversations SET messages = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(messages), conversationId]
    )

    return {
      success: true,
      message: 'Conversation sauvegardée'
    }

  } catch (error) {
    console.error('Erreur sauvegarde conversation:', error)
    return {
      success: false,
      error: 'Erreur lors de la sauvegarde'
    }
  }
})
