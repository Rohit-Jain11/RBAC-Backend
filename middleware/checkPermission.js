const pool = require("../config/db");

const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const roleId = req.user.role;

      const result = await pool.query(
        `SELECT p.name FROM role_permissions rp
         JOIN permissions p ON rp.permission_id = p.id
         WHERE rp.role_id=$1 AND p.name=$2`,
        [roleId, permissionName]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({
          message: "Access Denied"
        });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };
};

module.exports = checkPermission;
