export const http = () => {
  const unAuthorized = function () {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  };

  const internalServerError = function () {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  };

  const badRequest = function () {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  };

  const forbidden = function () {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    });
  };

  const notFound = function () {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    });
  };

  return {
    unAuthorized,
    internalServerError,
    badRequest,
    forbidden,
    notFound,
  };
};
