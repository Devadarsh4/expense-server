const bcrypt = require("bcryptjs");
const rbacDao = require("../dao/rbacDao");
const { generateTemporaryPassword } = require("../utility/passwordUtil");
const emailService = require("../services/emailService");
const { USER_ROLES } = require("../utility/userRoles");

const rbacController = {
    // ✅ CREATE USER
    create: async(req, res) => {
        try {
            const adminUser = req.user;
            const { name, email, role } = req.body;

            // Validate role
            if (!USER_ROLES.includes(role)) {
                return res.status(400).json({
                    message: "Invalid role"
                });
            }

            // Generate temporary password
            const tempPassword = generateTemporaryPassword(8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(tempPassword, salt);

            const user = await rbacDao.create(
                email,
                name,
                role,
                hashedPassword,
                adminUser._id
            );

            // Send email (non-blocking)
            try {
                await emailService.send(
                    email,
                    "Temporary Password",
                    `Your temporary password is: ${tempPassword}`
                );
            } catch (error) {
                console.error(
                    `Email failed, temporary password is ${tempPassword}`,
                    error
                );
            }

            return res.status(201).json({
                message: "User created!",
                user
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    },

    // ✅ UPDATE USER
    update: async(req, res) => {
        try {
            const { userId, name, role } = req.body;

            if (role && !USER_ROLES.includes(role)) {
                return res.status(400).json({
                    message: "Invalid role"
                });
            }

            const user = await rbacDao.update(userId, name, role);

            return res.status(200).json({
                message: "User updated!",
                user
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    },

    // ✅ DELETE USER
    delete: async(req, res) => {
        try {
            const { userId } = req.body;

            await rbacDao.delete(userId);

            return res.status(200).json({
                message: "User deleted!"
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }
};

module.exports = rbacController;