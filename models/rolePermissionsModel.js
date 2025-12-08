const pool = require('../config/db.js');

const getPermissionsByRoleId = async (roleId) =>  {
    const res = await pool.query(
        `SELECT permission_id FROM role_permissions WHERE role_id=$1`,
         [roleId]
    );
    return res.rows.map(r => r.permission_id);
};

const addPermissionToRole = async (roleId, permissionId) => {
    await pool.query(
        `INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)`,
        [roleId, permissionId]
    );
};

const removePermissionFromRole = async (roleId, permissionId) => {
    await pool.query(
        `DELETE FROM role_permissions WHERE role_id=$1 AND permission_id=$2`,
        [roleId, permissionId]
    );
}

module.exports = {
    getPermissionsByRoleId,
    addPermissionToRole,
    removePermissionFromRole
}