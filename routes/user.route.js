const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.post("/signup", userController.signup);
router.get('/all', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/update/:id', authMiddleware, userController.updateUser);
router.delete('/soft-delete/:id', authMiddleware, userController.softDeleteUser);
router.post('/login', userController.login);

module.exports = router;