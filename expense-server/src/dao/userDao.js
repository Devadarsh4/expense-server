const User = require("../model/User");

const userDao = {
    findByEmail: async(email) => {
        return await User.findOne({ email });
    },

    createUser: async(data) => {
        const user = new User(data);
        return await user.save();
    }
};

module.exports = userDao;