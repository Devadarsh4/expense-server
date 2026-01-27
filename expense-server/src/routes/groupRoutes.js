const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.post("/create", groupController.createGroup);
router.post("/add-members", groupController.addMembers);
router.get("/:email", groupController.getGroupByEmail);

module.exports = router;