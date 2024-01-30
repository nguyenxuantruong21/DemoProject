const express = require('express')
const router = express.Router()

router.use('/api/auth', require('./auth.router'))
router.use('/api/book', require('./book.router'))

module.exports = router
