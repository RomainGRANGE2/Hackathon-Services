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
                'SELECT * FROM "service" WHERE user_id = $1',
                [userId]
            )
            return result.rows
        } catch (error) {
            throw error
        }
    }

    const createService = async function(body,userId) {
        console.log(body)
        try {
            const result = await query(
                'INSERT INTO "service" (user_id, title,description, price) VALUES ($1, $2, $3, $4)',
                [
                   userId,
                    body.title,
                    body.description,
                    body.price,
                ]
            )
            return result.rows
        } catch (error) {
            throw error
        }
    }

    return {
        getAllServices,
        getServiceById,
        getServicesByUserId,
        createService
    }
}
