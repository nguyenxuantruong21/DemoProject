const express = require('express')
const MailController = require('../controllers/mailler.controller')
const { asyncHandler } = require('../utils')
const router = express.Router()

router.post('/send-mail', asyncHandler(MailController.sendMail))

module.exports = router
