const express = require('express')
const { asyncHandler } = require('../utils/index')
const AuthController = require('../controllers/auth.controller')
const passport = require('passport')
const { config } = require('dotenv')
const { Authorization } = require('../middlewares/authorization.middleware')
config()
const router = express.Router()

router.post('/register', asyncHandler(AuthController.register))
router.post('/login', asyncHandler(AuthController.login))

// localhost:4400/api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
// localhost:4400/api/auth/google/callback
router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (error, profile) => {
      req.user = profile
      next()
    })(req, res, next)
  },
  (req, res) => {
    res.redirect(`${process.env.URL_CLIENT}/login-success/${req.user?.id}`)
  }
)

router.post('/login-success', asyncHandler(AuthController.loginOpenAuth))

router.use(Authorization)

router.post('/logout', asyncHandler(AuthController.logOut))

module.exports = router
