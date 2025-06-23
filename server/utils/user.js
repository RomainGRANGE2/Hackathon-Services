import { query } from '~/server/utils/db.js'

export const user = () => {

    const createUser = async function(body,hash){
        try {
            const result = await query('INSERT INTO "user" (lastname, firstname, email,password,role,description,phone,location) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
                [
                    body.lastname,
                    body.firstname,
                    body.email,
                    hash,
                    body.role ? 'provider' : 'customer',
                    body.description,
                    body.phone,
                    body.location,
                ]
            )
            return result.rows
        } catch (error){
            throw error
        }
    }

    const getUserByEmail = async function(email){
        try {
            const result = await query(
                'SELECT * FROM "user" WHERE email = $1',
                [email]
            )
            return result.rows
        } catch (error){
            throw error
        }
    }

    return {
        createUser,
        getUserByEmail
    }
}