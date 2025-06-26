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
    projectSummary: z.string(),
    services: z.array(z.object({
      serviceId: z.number(),
      taskTitle: z.string(),
      matchReason: z.string()
    }))
  });

export default defineEventHandler(async (event) => {
  const schema = buildSchema(event);
  const result = await readValidatedBody(event, (body) =>
    schema.safeParseAsync(body)
  );

  if (!result.success) {
    badRequest();
  }

  const { projectSummary, services } = await readBody(event);
  const userSession = await getUserSession(event);
  const userId = userSession?.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Non autorisé",
    });
  }

  try {
    const customer = await getUserById(userId);
    if (!customer) {
      throw createError({
        statusCode: 404,
        statusMessage: "Utilisateur non trouvé",
      });
    }

    const results = [];
    const errors = [];

    // Traiter chaque service
    for (const serviceBooking of services) {
      try {
        // Récupérer les détails du service
        const serviceDetails = await getServiceById(serviceBooking.serviceId);
        if (!serviceDetails) {
          errors.push(`Service ${serviceBooking.serviceId} non trouvé`);
          continue;
        }

        // Vérifier que l'utilisateur ne réserve pas son propre service
        if (serviceDetails.user_id === userId) {
          errors.push(`Vous ne pouvez pas réserver votre propre service: ${serviceDetails.title}`);
          continue;
        }

        // Générer le message personnalisé
        const message = `🚀 PROJET: ${projectSummary}

📋 TÂCHE: ${serviceBooking.taskTitle}

💡 POURQUOI CE SERVICE: ${serviceBooking.matchReason}

Cette demande fait partie d'un projet plus large analysé par notre IA. Nous avons identifié votre service comme étant parfaitement adapté à cette partie du projet.

Merci de me recontacter pour discuter des détails et de la planification.`;

        // Récupérer les infos du prestataire
        const provider = await getUserById(serviceDetails.user_id);
        if (!provider) {
          errors.push(`Prestataire du service ${serviceDetails.title} non trouvé`);
          continue;
        }

        // Créer la réservation
        const newReservation = await createReservation(
          serviceDetails.user_id, // provider_id
          userId, // customer_id
          serviceBooking.serviceId, // service_id
          message // message
        );

        // Envoyer l'email au prestataire
        const tos = [{ email: provider.email }];

        await sendTransactionnalTemplate(
          payloadFactory(
            tos.map((user) => emailFactory(user.email)),
            8,
            "Nouvelle réservation pour votre service - Projet IA",
            {
              providerName: provider.firstname,
              serviceName: serviceDetails.title,
              customerName: `${customer.firstname} ${customer.lastname}`,
              customerEmail: customer.email,
              customerPhone: customer.phone || "Non renseigné",
              message: message,
              servicePrice: serviceDetails.price,
              url: process.env.URL_DEV,
              reservationId: newReservation.id,
            }
          )
        );

        results.push({
          serviceId: serviceBooking.serviceId,
          serviceName: serviceDetails.title,
          reservationId: newReservation.id,
          success: true
        });

      } catch (error) {
        console.error(`Erreur réservation service ${serviceBooking.serviceId}:`, error);
        errors.push(`Erreur pour ${serviceBooking.serviceId}: ${error.message}`);
      }
    }

    return {
      success: results.length > 0,
      message: `${results.length} réservation(s) envoyée(s) avec succès`,
      results,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    console.error("Erreur lors des réservations multiples:", error);
    return {
      success: false,
      message: error.message || "Erreur lors des réservations",
    };
  }
});
