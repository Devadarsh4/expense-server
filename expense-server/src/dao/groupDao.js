const Group = require("../model/group");

const groupDao = {

    createGroup: async(data) => {
        const newGroup = new Group(data);
        return await newGroup.save();
    },

    updateGroup: async(data) => {
        const { groupId, name, description, thumbnail, adminEmail, paymentStatus } = data;

        return await Group.findByIdAndUpdate(
            groupId, { name, description, thumbnail, adminEmail, paymentStatus }, { new: true }
        );
    },

    addMembers: async(groupId, ...membersEmails) => {
        return await Group.findByIdAndUpdate(
            groupId, { $addToSet: { membersEmail: { $each: membersEmails } } }, { new: true }
        );
    },

    getGroupByEmail: async(email) => {
        return await Group.find({ membersEmail: email });
    }
};

module.exports = groupDao;