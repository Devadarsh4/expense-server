const groupDao = require("../dao/groupDao");

exports.createGroup = async(req, res) => {
    try {
        const group = await groupDao.createGroup(req.body);
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: "Error creating group" });
    }
};

exports.addMembers = async(req, res) => {
    const { groupId, members } = req.body;
    const group = await groupDao.addMembers(groupId, ...members);
    res.json(group);
};

exports.getGroupByEmail = async(req, res) => {
    const groups = await groupDao.getGroupByEmail(req.params.email);
    res.json(groups);
};