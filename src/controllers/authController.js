const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { validationResult } = require("express-validator");
const User = require("../model/User");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authController = {

    /* ================= REGISTER ================= */
    register: async(req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password required" });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                email,
                password: hashedPassword,
            });

            const token = jwt.sign({ userId: user._id, email: user.email },
                process.env.JWT_SECRET, { expiresIn: "1d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
            });

            return res.status(201).json({
                message: "Registration successful",
                user: {
                    id: user._id,
                    email: user.email,
                },
            });
        } catch (error) {
            console.error("Register error:", error);
            return res.status(500).json({ message: "Register failed" });
        }
    },

    /* ================= LOGIN ================= */
    login: async(req, res) => {
        try {
            // ✅ express-validator result
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid password" });
            }

            const token = jwt.sign({ userId: user._id, email: user.email },
                process.env.JWT_SECRET, { expiresIn: "1d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
            });

            return res.json({
                message: "Login successful",
                user: {
                    id: user._id,
                    email: user.email,
                },
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ message: "Login failed" });
        }
    },

    /* ================= IS USER LOGGED IN ================= */
    isUserLoggedIn: async(req, res) => {
        try {
            const token = req.cookies && req.cookies.token;

            if (!token) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            return res.json({
                user: {
                    id: decoded.userId,
                    email: decoded.email,
                },
            });
        } catch (error) {
            console.error("JWT verify error:", error);
            return res.status(401).json({ message: "Invalid token" });
        }
    },

    /* ================= LOGOUT ================= */
    logout: async(req, res) => {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        return res.json({ message: "Logout successful" });
    },

    /* ================= GOOGLE SSO ================= */
    googleSso: async(req, res) => {
        try {
            const { idToken } = req.body;

            if (!idToken) {
                return res.status(400).json({ message: "Google token missing" });
            }

            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) {
                return res.status(401).json({ message: "Invalid Google token" });
            }

            const { sub: googleId, email, name } = payload;

            if (!email) {
                return res.status(401).json({ message: "Google authentication failed" });
            }

            let user = await User.findOne({ email });

            if (!user) {
                user = await User.create({
                    email,
                    name: name || "",
                    googleId,
                });
            }

            const token = jwt.sign({ userId: user._id, email: user.email },
                process.env.JWT_SECRET, { expiresIn: "1d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
            });

            return res.json({
                message: "Google login successful",
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                },
            });
        } catch (error) {
            console.error("Google SSO error:", error);
            return res.status(401).json({ message: "Google authentication failed" });
        }
    },
};

module.exports = authController;