const express = require('express')
const { asyncHandler } = require('../utils/index')
const AuthController = require('../controllers/auth.controller')
const router = express.Router()

router.post('/register', asyncHandler(AuthController.register))
router.post('/login', asyncHandler(AuthController.login))
router.post('/logout', asyncHandler(AuthController.logout))

module.exports = router
