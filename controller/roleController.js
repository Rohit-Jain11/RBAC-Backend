const { getRoleByName, createRoleByName, deleteRoleById, getRoleById, updateRoleById } = require("../models/roleModel");


const createRole = async (req, res) => {
    const {name, description} = req.body;

    if(!name) return res.status(400).json({success: false, message: "Role is required."});

    try {
        const existing = await getRoleByName(name);
        if(existing) return res.status(400).json({success: false, message: "Role is already exists."});

        const role = await createRoleByName(name, description);

        return res.status(201).json({success: true, data: role});
    } catch(err) {
        console.log("Create role error: ", err);
        return res.status(500).json({success: false, message: "Internal server error."});
    }
};

const deleteRole = async (req, res) => {
    const {roleId} = req.params;

    try {
        const role = await deleteRoleById(roleId);
        if(!role) return res.status(404).json({success: false, message: "Role not found."});

       return res.status(200).json({success: true, message: "Role deleted successfully."});
    } catch(err) {
        console.log("Role delete error: ", err);
        return res.status(500).json({success: false, message: "Internal server error."});
    }

}

const editRole = async (req, res) => {
    const {roleId} = req.params;

    try {
        const role = await getRoleById(roleId);
        if(!role)  return res.status(404).json({success: false, message: "Role not found."});

        return res.status(200).json({success: true, data: role});
    } catch(err) {
        console.log("Edit role error: ", err);
        return res.status(500).json({success: false, message: "Internal server error."});
    }
}

const updateRole = async (req, res) => {
    const {roleId} = req.params;
    const {name, description} = req.body;

    try {
        const role = await updateRoleById(roleId, name, description);
        if(!role) return res.status(404).json({success: false, message: "Role not found."});

        return res.status(200).json({success: true, message: "Role updated successfully."});
    } catch(err) {
        console.log("Update role error: ", err);
        return res.status(500).json({success: false, message: "Internal server error."});
    }
}

module.exports = {
    createRole,
    editRole,
    updateRole,
    deleteRole
}