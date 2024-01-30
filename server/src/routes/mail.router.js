const express = require('express')
const MailController = require('../controllers/mail.controller')
const { asyncHandler } = require('../utils')
const router = express.Router()

router.post('/sendMail', asyncHandler(MailController.sendMail))

module.exports = router
