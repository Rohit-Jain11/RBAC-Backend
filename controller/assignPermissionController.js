const { getPermissionsByRoleId, addPermissionToRole, removePermissionFromRole } = require("../models/rolePermissionsModel");

const assignPermissionsToRole = async (req, res) => {
      
    const {roleId} = req.params;
    const {permissions} = req.body;

    try {
        const currentPermissions  =  await getPermissionsByRoleId(roleId);

        const permissionsToAdd = permissions.filter(p => !currentPermissions.includes(p));

        const permissionsToRemove = currentPermissions.filter(p => !permissions.includes(p));

        for(let permId of permissionsToAdd) {
            await addPermissionToRole(roleId, permId);
        }

        for (let permId of permissionsToRemove) {
         await removePermissionFromRole(roleId, permId);
        }

        return res.status(200).json({success: false, message: "Permission updated sucessfully.", data: {added: permissionsToAdd, removed: permissionsToRemove}});
    } catch(err) {
        console.log("Assign permission error: ", err);
        return res.status(500).json({success: false, message: "Internal server error."});
    }
}

module.exports = {
    assignPermissionsToRole
}