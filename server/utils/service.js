import { query } from '~/server/utils/db.js'

export const service = () => {

    const getAllServices = async function() {
        try {
            const result = await query('SELECT * FROM "service"')
            return result.rows
        } catch (error) {
            throw error
        }
    }

    // Fonction pour récupérer un service par son ID
    const getServiceById = async function(id) {
        try {
            const result = await query(
                'SELECT * FROM "service" WHERE id = $1',
                [id]
            )
            return result.rows[0]
        } catch (error) {
            throw error
        }
    }

    // Fonction pour récupérer les services par ID utilisateur
    const getServicesByUserId = async function(userId) {
        try {
            const result = await query(
                'SELECT * FROM "service" WHERE user_id = $1 ORDER BY created_at DESC',
                [userId]
            )
            return result.rows
        } catch (error) {
            throw error
        }
    }

    return {
        getAllServices,
        getServiceById,
        getServicesByUserId
    }
}
