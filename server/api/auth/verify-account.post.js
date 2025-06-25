import { z } from 'zod';
import { http } from '~/server/utils/http.js';
import { user } from '~/server/utils/user.js';

const { badRequest } = http();
const { checkUuid, verifyAccount, resetUuid } = user();

const buildSchema = (event) =>
  z.object({
    uuid: z.string().uuid(),
  });

export default defineEventHandler(async (event) => {
  const schema = buildSchema(event);
  const result = await readValidatedBody(event, (body) =>
    schema.safeParseAsync(body)
  );

  if (!result.success) {
    badRequest();
  }

  const { uuid } = await readBody(event);

  try {
    const maybeUuid = await checkUuid(uuid);

    if (maybeUuid.length === 0) {
      badRequest();
    }

    await verifyAccount(uuid);
    await resetUuid(uuid);

    return {
      ok: true,
    };
  } catch (error) {
    throw error;
  }
});
