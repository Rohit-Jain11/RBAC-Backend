const pool = require('../config/db.js');

const createUser = async(name, email, password, role =2) => {
    const result = await pool.query(
        `INSERT INTO users (name,email, password, role) 
         values ($1, $2, $3, $4) 
         RETURNING id, name, email, role, created_at`,
         [name, email, password, role]
    );

    return result.rows[0];
};

const getUserByEmail = async(email) => {
    const result = await pool.query(
        `SELECT * FROM users where email = $1`,
        [email]
    );

    return  result.rows[0];
};


const getUserById = async (id) => {
    const result = await pool.query(
        `SELECT id, name, email, role, created_at FROM users WHERE id = $1`,
        [id]
    );

    return result.rows[0];
};

const updateUserById = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return null; // nothing to update

  const setQuery = keys.map((key, index) => `${key}=$${index + 1}`).join(', ');

  const result = await pool.query(
    `UPDATE users
     SET ${setQuery}
     WHERE id=$${keys.length + 1}
     RETURNING id, name, email, role, created_at`,
    [...values, id]
  );

  return result.rows[0];
};

const deleteUserById = async (id) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id=$1 RETURNING id, name, email, role, created_at`,
    [id]
  );
  return result.rows[0];
};

const getAllUsers = async () => {
    const result = await pool.query(
        `SELECT  id, name, email, role, created_at FROM users`
    );

    return result.rows;
};

const checkAdminExists = async () => {
    const result = await pool.query (
        `SELECT * FROM users WHERE role = 1 LIMIT 1`
    );

    return result.rows.length > 0;
};

// Save reset token + expiry
const saveResetToken = async (email, token, expiry) => {
  await pool.query(
    `UPDATE users SET reset_token=$1, reset_token_expiry=$2 WHERE email=$3`,
    [token, expiry, email]
  );
};

// Find user by reset token
const getUserByResetToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE reset_token=$1`,
    [token]
  );
  return result.rows[0];
};

// Clear reset token on success
const clearResetToken = async (id) => {
  await pool.query(
    `UPDATE users SET reset_token=NULL, reset_token_expiry=NULL WHERE id=$1`,
    [id]
  );
};


// Update password & clear reset token
const updatePasswordAndClearToken = async (userId, newPassword) => {
  await pool.query(
    `UPDATE users 
     SET password=$1, reset_token=NULL, reset_token_expiry=NULL 
     WHERE id=$2`,
    [newPassword, userId]
  );
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUserById,
    getAllUsers,
    checkAdminExists,
    saveResetToken,
    getUserByResetToken,
    clearResetToken,
    updatePasswordAndClearToken,
    deleteUserById
};