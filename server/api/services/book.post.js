import { z } from "zod";
import { http } from "~/server/utils/http.js";
import { user } from "~/server/utils/user.js";
import { service } from "~/server/utils/service.js";
import { reservation } from "~/server/utils/reservation.js";
import { brevo } from "~/server/utils/brevo.js";

const { badRequest } = http();
const { getUserById } = user();
const { getServiceById } = service();
const { createReservation } = reservation();
const { emailFactory, payloadFactory, sendTransactionnalTemplate } = brevo();

const buildSchema = (event) =>
  z.object({
    serviceId: z.number(),
    message: z.string().optional(),
  });

export default defineEventHandler(async (event) => {
  const schema = buildSchema(event);
  const result = await readValidatedBody(event, (body) =>
    schema.safeParseAsync(body)
  );

  if (!result.success) {
    badRequest();
  }

  const { serviceId, message } = await readBody(event);
  const userSession = await getUserSession(event);
  const userId = userSession?.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Non autorisé",
    });
  }

  try {
    // Récupérer les détails du service
    const serviceDetails = await getServiceById(serviceId);
    if (!serviceDetails) {
      throw createError({
        statusCode: 404,
        statusMessage: "Service non trouvé",
      });
    }

    // Vérifier que l'utilisateur ne réserve pas son propre service
    if (serviceDetails.user_id === userId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Vous ne pouvez pas réserver votre propre service",
      });
    }

    // Récupérer les infos de l'utilisateur qui réserve
    const customer = await getUserById(userId);
    if (!customer) {
      throw createError({
        statusCode: 404,
        statusMessage: "Utilisateur non trouvé",
      });
    }

    // Récupérer les infos du prestataire
    const provider = await getUserById(serviceDetails.user_id);
    if (!provider) {
      throw createError({
        statusCode: 404,
        statusMessage: "Prestataire non trouvé",
      });
    }

    // Créer la réservation en base de données
    const newReservation = await createReservation(
      serviceDetails.user_id, // provider_id
      userId, // customer_id
      serviceId, // service_id
      message // message
    );

    // Envoyer l'email au prestataire
    const tos = [
      {
        email: provider.email,
      },
    ];

    await sendTransactionnalTemplate(
      payloadFactory(
        tos.map((user) => emailFactory(user.email)),
        8,
        "Nouvelle réservation pour votre service",
        {
          providerName: provider.firstname,
          serviceName: serviceDetails.title,
          customerName: `${customer.firstname} ${customer.lastname}`,
          customerEmail: customer.email,
          customerPhone: customer.phone || "Non renseigné",
          message: message || "Aucun message particulier",
          servicePrice: serviceDetails.price,
          url: process.env.URL_DEV,
          reservationId: newReservation.id,
        }
      )
    );

    return {
      success: true,
      message: "Demande de réservation envoyée avec succès",
      reservationId: newReservation.id,
    };
  } catch (error) {
    console.error("Erreur lors de la réservation:", error);
    return {
      success: false,
      message: error.message || "Erreur lors de la réservation",
    };
  }
});
