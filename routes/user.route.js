const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

router.post("/signup", userController.signup);
router.get('/all', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/update/:id', userController.updateUser);
router.delete('/soft-delete/:id', userController.softDeleteUser);

module.exports = router;