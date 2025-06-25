import { z } from 'zod';
import { http } from '~/server/utils/http.js';
import { user } from '~/server/utils/user.js';

const { unAuthorized, badRequest } = http();
const { getUserByEmailAndVerify } = user();

const buildSchema = (event) =>
  z.object({
    email: z.string().email(),
    password: z.string(),
  });

export default defineEventHandler(async (event) => {
  const schema = buildSchema(event);
  const result = await readValidatedBody(event, (body) =>
    schema.safeParseAsync(body)
  );

  if (!result.success) {
    badRequest();
  }
  const { email, password } = await readBody(event);

  try {
    const result = await getUserByEmailAndVerify(email);

    if (result.length === 0) {
      unAuthorized();
    }

    const user = result[0];

    const passwordValid = await verifyPassword(user.password, password);

    if (!passwordValid) {
      unAuthorized();
    }

    await setUserSession(event, {
      user: {
        email: user.email,
        role: user.role,
        id: user.id,
      },
    });

    return {
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
});
