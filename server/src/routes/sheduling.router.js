const express = require('express')
const { asyncHandler } = require('../utils')
const ShedulingController = require('../controllers/sheduling.controller')
const router = express.Router()

router.post('/run-sheduling', asyncHandler(ShedulingController.runSheduling))

module.exports = router
