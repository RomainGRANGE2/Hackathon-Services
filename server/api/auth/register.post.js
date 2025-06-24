import {z} from "zod";
import {http} from "~/server/utils/http.js";
import {user} from "~/server/utils/user.js";
import { brevo } from "~/server/utils/brevo.js";
import { v4 as uuidv4 } from 'uuid';
const { unAuthorized, badRequest } = http()
const { emailFactory, payloadFactory, sendTransactionnalTemplate } = brevo()
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
        const uuid = uuidv4();
        await createUser(body,hash,uuid)

        const tos = [
            {
                email: body.email
            }
        ]

        await sendTransactionnalTemplate(payloadFactory(
            tos.map(user => emailFactory(user.email)),
            7,
            "Vérification du compte",
            {
                uuid: uuid,
                url:process.env.URL_DEV
            }
        ))

        return {
            statusCode: 200,
        }
    } catch (error) {
        throw error
    }
})