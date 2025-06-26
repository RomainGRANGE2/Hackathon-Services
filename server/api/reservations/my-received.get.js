import { reservation } from "~/server/utils/reservation.js";

const { getReservationsByProviderId } = reservation();

export default defineEventHandler(async (event) => {
  const userSession = await getUserSession(event);
  const userId = userSession?.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Non autorisé",
    });
  }

  try {
    const reservations = await getReservationsByProviderId(userId);

    return {
      success: true,
      reservations,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    return {
      success: false,
      message:
        error.message || "Erreur lors de la récupération des réservations",
    };
  }
});
