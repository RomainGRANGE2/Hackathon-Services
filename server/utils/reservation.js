import { query } from "~/server/utils/db.js";

export const reservation = () => {
  // Créer une nouvelle réservation
  const createReservation = async function (
    providerId,
    customerId,
    serviceId,
    message
  ) {
    try {
      const result = await query(
        'INSERT INTO "reservation" (provider_id, customer_id, service_id, message, status, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
        [providerId, customerId, serviceId, message || "", "pending"]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Récupérer les réservations reçues par un prestataire
  const getReservationsByProviderId = async function (providerId) {
    try {
      const result = await query(
        `
        SELECT 
          r.*,
          s.title as service_title,
          s.price as service_price,
          u.firstname as customer_firstname,
          u.lastname as customer_lastname,
          u.email as customer_email,
          u.phone as customer_phone
        FROM "reservation" r
        JOIN "service" s ON r.service_id = s.id
        JOIN "user" u ON r.customer_id = u.id
        WHERE r.provider_id = $1
        ORDER BY r.created_at DESC
      `,
        [providerId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Récupérer les réservations faites par un client
  const getReservationsByCustomerId = async function (customerId) {
    try {
      const result = await query(
        `
        SELECT 
          r.*,
          s.title as service_title,
          s.price as service_price,
          u.firstname as provider_firstname,
          u.lastname as provider_lastname,
          u.email as provider_email,
          u.phone as provider_phone
        FROM "reservation" r
        JOIN "service" s ON r.service_id = s.id
        JOIN "user" u ON r.provider_id = u.id
        WHERE r.customer_id = $1
        ORDER BY r.created_at DESC
      `,
        [customerId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Mettre à jour le statut d'une réservation
  const updateReservationStatus = async function (
    reservationId,
    status,
    providerId
  ) {
    try {
      // Vérifier que la réservation appartient bien au prestataire
      const result = await query(
        'UPDATE "reservation" SET status = $1, updated_at = NOW() WHERE id = $2 AND provider_id = $3 RETURNING *',
        [status, reservationId, providerId]
      );

      if (result.rows.length === 0) {
        throw new Error("Réservation non trouvée ou non autorisée");
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Récupérer une réservation par son ID
  const getReservationById = async function (reservationId) {
    try {
      const result = await query(
        `
        SELECT 
          r.*,
          s.title as service_title,
          s.price as service_price,
          customer.firstname as customer_firstname,
          customer.lastname as customer_lastname,
          customer.email as customer_email,
          customer.phone as customer_phone,
          provider.firstname as provider_firstname,
          provider.lastname as provider_lastname,
          provider.email as provider_email,
          provider.phone as provider_phone
        FROM "reservation" r
        JOIN "service" s ON r.service_id = s.id
        JOIN "user" customer ON r.customer_id = customer.id
        JOIN "user" provider ON r.provider_id = provider.id
        WHERE r.id = $1
      `,
        [reservationId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  return {
    createReservation,
    getReservationsByProviderId,
    getReservationsByCustomerId,
    updateReservationStatus,
    getReservationById,
  };
};
