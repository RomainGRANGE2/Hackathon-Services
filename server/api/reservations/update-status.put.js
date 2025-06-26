import { z } from "zod";
import { http } from "~/server/utils/http.js";
import { reservation } from "~/server/utils/reservation.js";

const { badRequest } = http();
const { updateReservationStatus, getReservationById } = reservation();

const buildSchema = (event) =>
  z.object({
    reservationId: z.number(),
    status: z.enum(["accepted", "rejected"]),
  });

export default defineEventHandler(async (event) => {
  const schema = buildSchema(event);
  const result = await readValidatedBody(event, (body) =>
    schema.safeParseAsync(body)
  );

  if (!result.success) {
    badRequest();
  }

  const { reservationId, status } = await readBody(event);
  const userSession = await getUserSession(event);
  const userId = userSession?.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Non autorisé",
    });
  }

  try {
    // Mettre à jour le statut de la réservation
    const updatedReservation = await updateReservationStatus(
      reservationId,
      status,
      userId
    );

    return {
      success: true,
      message: `Réservation ${
        status === "accepted" ? "acceptée" : "refusée"
      } avec succès`,
      reservation: updatedReservation,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation:", error);
    return {
      success: false,
      message:
        error.message || "Erreur lors de la mise à jour de la réservation",
    };
  }
});
