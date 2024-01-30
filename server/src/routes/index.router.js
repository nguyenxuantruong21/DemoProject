const express = require('express')
const router = express.Router()

router.use('/api/auth', require('./auth.router'))
router.use('/api/mail', require('./mail.router'))

module.exports = router
