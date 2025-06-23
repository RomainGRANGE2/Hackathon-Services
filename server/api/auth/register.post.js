import {z} from "zod";
import {http} from "~/server/utils/http.js";
import {user} from "~/server/utils/user.js";
const { unAuthorized, badRequest } = http()
const { createUser } = user()

const buildSchema = (event) => z.object({
    firstname:z.string(),
    lastname:z.string(),
    role:z.boolean(),
    description:z.string().nullable(),
    phone:z.string().nullable(),
    location:z.string().nullable(),
    email: z.string().email(),
    password: z.string()
});

export default defineEventHandler(async (event) => {
    const schema = buildSchema(event)
    const result = await readValidatedBody(event, body => schema.safeParseAsync(body))

    if (!result.success){
        badRequest()
    }

    const body = await readBody(event)

    try {
        const hash = await hashPassword(body.password)
        await createUser(body,hash)

        return {
            statusCode: 200,
        }
    } catch (error) {
        throw error
    }
})