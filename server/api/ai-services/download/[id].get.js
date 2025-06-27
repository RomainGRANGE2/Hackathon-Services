import { query } from '../../../utils/db.js'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const fileId = getRouterParam(event, 'id')
    
    if (!fileId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de fichier requis'
      })
    }

    // Récupérer les informations du fichier depuis la base
    const result = await query(
      'SELECT * FROM ai_files WHERE id = $1',
      [fileId]
    )

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Fichier non trouvé'
      })
    }

    const file = result.rows[0]

    // Vérifier que le fichier existe sur le disque
    if (!existsSync(file.file_path)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Fichier physique non trouvé'
      })
    }

    // Lire le fichier
    const fileData = await readFile(file.file_path)

    // Définir les en-têtes appropriés
    setHeader(event, 'Content-Type', file.file_type || 'application/octet-stream')
    setHeader(event, 'Content-Disposition', `attachment; filename="${file.original_filename}"`)
    setHeader(event, 'Content-Length', file.file_size.toString())

    return fileData

  } catch (error) {
    console.error('Erreur download:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du téléchargement'
    })
  }
})
