const User = require("../model/users");

const rbacDao = {

    // CREATE USER (DB only)
    create: async(email, name, role, password, adminId) => {

        // Prevent duplicate user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const user = await User.create({
            email,
            password, // already hashed
            name,
            role,
            adminId
        });

        // Hide password before returning
        user.password = undefined;

        return user;
    },

    // UPDATE USER
    update: async(userId, name, role) => {
        return await User.findByIdAndUpdate(
            userId, { name, role }, { new: true, runValidators: true }
        ).select("-password");
    },

    // DELETE USER
    delete: async(userId) => {
        return await User.findByIdAndDelete(userId);
    },

    // GET USERS BY ADMIN
    getUsersByAdminId: async(adminId) => {
        return await User.find({ adminId }).select("-password");
    }
};

module.exports = rbacDao;