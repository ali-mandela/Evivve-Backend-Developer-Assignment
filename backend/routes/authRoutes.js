const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware')
const {registerController, loginController,getAllUsersController} = require('../controller/authController')
router.post('/register', registerController)
router.post('/login', loginController)

router.get('/all-users',protect,getAllUsersController )

module.exports = router;