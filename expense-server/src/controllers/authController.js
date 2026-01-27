const { OAuth2Client } = require("google-auth-library");
const userDao = require("../dao/userDao");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async(req, res) => {
    try {
        const { idToken } = req.body;

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { email, name } = ticket.getPayload();

        let user = await userDao.findByEmail(email);

        if (!user) {
            user = await userDao.createUser({
                email,
                name,
                password: "GOOGLE_AUTH"
            });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ message: "Google login failed" });
    }
};