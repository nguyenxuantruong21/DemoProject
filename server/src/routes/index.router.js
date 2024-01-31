const express = require('express')
const router = express.Router()

router.use('/api/auth', require('./auth.router'))
router.use('/api/mail', require('./mailler.router'))
router.use('/api/sheduling', require('./sheduling.router'))

module.exports = router
