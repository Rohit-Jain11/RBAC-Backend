const pool = require('../config/db.js');


const getRoleByName = async (name) => {
   const res = await pool.query(`SELECT * FROM roles WHERE name=$1`, [name]);
   return res.rows[0];
};

const getRoleById = async (roleId) => {
    const res = await pool.query(`SELECT * FROM roles WHERE id = $1`, [roleId]);
    return res.rows[0];
};

const createRoleByName = async (name, description = null) => {
   const res = await pool.query(
    `INSERT INTO roles (name, description) values ($1, $2) RETURNING *`, [name, description]
   );
   return res.rows[0];
};

const updateRoleById = async (roleId, name, description) => {
    const res = await pool.query(
        `UPDATE roles 
         SET name = COALESCE($1, name),
          description = COALESCE($2, description)
          WHERE id = $3
          RETURNING *`,
          [name, description, roleId]
    );
    return res.rows[0];
}

const deleteRoleById = async(roleId) => {
    const res = await pool.query(
        `DELETE FROM roles WHERE id = $1 RETURNING *`,
        [roleId]
    );
    return res.rows[0];
};

const listOfRole = async () => {
    const res = await pool.query(`SELECT * FROM roles`);
    return res.rows;
};

module.exports = {
    getRoleByName,
    createRoleByName,
    deleteRoleById,
    getRoleById,
    updateRoleById,
    listOfRole
}