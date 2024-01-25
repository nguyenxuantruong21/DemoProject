const AuthService = require('../services/auth.service')
const { SuccessResponse } = require('../messages/success.response')

class AuthController {
  static register = async (req, res, next) => {
    const { name, email, password } = req.body
    new SuccessResponse({
      message: 'Register successfully',
      metadata: await AuthService.register({ name, email, password })
    }).send(res)
  }

  static login = async (req, res, next) => {
    const { email, password } = req.body
    new SuccessResponse({
      message: 'Login successfully',
      metadata: await AuthService.login({ email, password })
    }).send(res)
  }
}

module.exports = AuthController
