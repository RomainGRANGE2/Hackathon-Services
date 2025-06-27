import { query } from '../../utils/db.js'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      return {
        success: false,
        error: 'Aucun fichier reçu'
      }
    }

    const conversationIdField = formData.find(field => field.name === 'conversationId')
    const fileField = formData.find(field => field.name === 'file')

    if (!conversationIdField || !fileField) {
      return {
        success: false,
        error: 'Paramètres manquants'
      }
    }

    const conversationId = conversationIdField.data.toString()
    const file = fileField

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(process.cwd(), 'uploads', 'ai-services')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = path.extname(file.filename || '')
    const storedFilename = `${timestamp}_${randomString}${fileExtension}`
    const filePath = path.join(uploadsDir, storedFilename)

    // Sauvegarder le fichier
    await writeFile(filePath, file.data)

    // Extraire le contenu du fichier si c'est du texte
    let fileContent = ''
    if (file.type?.startsWith('text/') || fileExtension === '.txt') {
      fileContent = file.data.toString('utf-8')
    } else {
      fileContent = `[Fichier binaire: ${file.filename}]`
    }

    // Enregistrer en base de données
    const dbResult = await query(
      'INSERT INTO ai_files (conversation_id, original_filename, stored_filename, file_path, file_type, file_size, is_input) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        conversationId,
        file.filename,
        storedFilename,
        filePath,
        file.type,
        file.data.length,
        true
      ]
    )

    const savedFile = dbResult.rows[0]

    return {
      success: true,
      file: {
        id: savedFile.id,
        name: file.filename,
        type: file.type,
        size: file.data.length,
        path: filePath,
        content: fileContent
      }
    }

  } catch (error) {
    console.error('Erreur upload:', error)
    return {
      success: false,
      error: 'Erreur lors de l\'upload du fichier'
    }
  }
})
