import { query } from '~/server/utils/db.js';

export const service = () => {
  const getAllServices = async function () {
    try {
      const result = await query('SELECT * FROM "service"');
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Fonction pour récupérer un service par son ID
  const getServiceById = async function (id) {
    try {
      const result = await query('SELECT * FROM "service" WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Fonction pour récupérer les services par ID utilisateur
  const getServicesByUserId = async function (userId) {
    try {
      const result = await query('SELECT * FROM "service" WHERE user_id = $1', [
        userId,
      ]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Fonction pour récupérer tous les services SAUF ceux de l'utilisateur connecté
  const getServicesExcludingUser = async function (userId) {
    try {
      const result = await query('SELECT * FROM "service" WHERE user_id != $1', [
        userId,
      ]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  const createService = async function (body, userId) {
    try {
      const result = await query(
        'INSERT INTO "service" (user_id, title, description, price,tag) VALUES ($1, $2, $3, $4, $5)',
        [
          userId,
          body.title,
          body.description,
          body.price,
          JSON.stringify(body.tag),
        ]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Fonction pour mettre à jour un service avec vérification de propriété
  const updateService = async function (id, body, userId) {
    try {
      // Vérifier si l'utilisateur est propriétaire du service
      const serviceToUpdate = await getServiceById(id);
      if (!serviceToUpdate) {
        throw new Error('Service non trouvé');
      }

      // Vérification de sécurité: l'utilisateur doit être le propriétaire
      if (serviceToUpdate.user_id != userId) {
        throw new Error(
          "Non autorisé: vous n'êtes pas le propriétaire de ce service"
        );
      }

      // Préparer les champs à mettre à jour
      let updateFields = [];
      let updateValues = [];
      let paramCount = 1;

      if (body.title !== undefined) {
        updateFields.push(`title = $${paramCount}`);
        updateValues.push(body.title);
        paramCount++;
      }

      if (body.description !== undefined) {
        updateFields.push(`description = $${paramCount}`);
        updateValues.push(body.description);
        paramCount++;
      }

      if (body.price !== undefined) {
        updateFields.push(`price = $${paramCount}`);
        updateValues.push(body.price);
        paramCount++;
      }

      if (body.status !== undefined) {
        updateFields.push(`status = $${paramCount}`);
        updateValues.push(body.status);
        paramCount++;
      }

      if (body.tag !== undefined) {
        updateFields.push(`tag = $${paramCount}`);
        updateValues.push(
          JSON.stringify(Array.isArray(body.tag) ? body.tag : [])
        );
        paramCount++;
      }

      if (body.image !== undefined) {
        updateFields.push(`image = $${paramCount}`);
        updateValues.push(body.image);
        paramCount++;
      }

      // Si aucun champ à mettre à jour, retourner le service tel quel
      if (updateFields.length === 0) {
        return serviceToUpdate;
      }

      // Ajouter l'ID pour la clause WHERE
      updateValues.push(id);

      const result = await query(
        `UPDATE "service" SET ${updateFields.join(
          ', '
        )} WHERE id = $${paramCount} RETURNING *`,
        updateValues
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Fonction pour supprimer un service avec vérification de propriété
  const deleteService = async function (id, userId) {
    try {
      // Vérifier si l'utilisateur est propriétaire du service
      const serviceToDelete = await getServiceById(id);
      if (!serviceToDelete) {
        throw new Error('Service non trouvé');
      }

      // Vérification de sécurité: l'utilisateur doit être le propriétaire
      if (serviceToDelete.user_id != userId) {
        throw new Error(
          "Non autorisé: vous n'êtes pas le propriétaire de ce service"
        );
      }

      const result = await query(
        'DELETE FROM "service" WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  return {
    getAllServices,
    getServiceById,
    getServicesByUserId,
    getServicesExcludingUser,
    createService,
    updateService,
    deleteService,
  };
};
