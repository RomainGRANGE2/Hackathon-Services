import { query } from "~/server/utils/db.js";

export const user = () => {
  const createUser = async function (body, hash, uuid) {
    try {
      const result = await query(
        'INSERT INTO "user" (lastname, firstname, email,password,role,description,phone,location,uuid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [
          body.lastname,
          body.firstname,
          body.email,
          hash,
          body.role ? "provider" : "customer",
          body.description,
          body.phone,
          body.location,
          uuid,
        ]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  const getUserByEmailAndVerify = async function (email) {
    try {
      const result = await query(
        'SELECT * FROM "user" WHERE email = $1 AND status = true',
        [email]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  const getUserByEmail = async function (email) {
    try {
      const result = await query('SELECT * FROM "user" WHERE email = $1', [
        email,
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  const checkPassword = async function (password, hash) {
    const bcrypt = await import("bcrypt");
    return await bcrypt.compare(password, hash);
  };

  const checkUuid = async function (uuid) {
    try {
      const result = await query('SELECT * FROM "user" WHERE uuid = $1', [
        uuid,
      ]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  const verifyAccount = async function (uuid) {
    try {
      const result = await query(
        'UPDATE "user" SET status = true WHERE uuid = $1',
        [uuid]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  const resetUuid = async function (uuid) {
    try {
      const result = await query(
        'UPDATE "user" SET uuid = NULL WHERE uuid = $1',
        [uuid]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  const getUserById = async function (id) {
    try {
      const result = await query('SELECT * FROM "user" WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  return {
    createUser,
    getUserByEmailAndVerify,
    getUserByEmail,
    getUserById,
    checkPassword,
    checkUuid,
    verifyAccount,
    resetUuid,
  };
};
