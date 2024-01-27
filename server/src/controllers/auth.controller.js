const AuthService = require('../services/auth.service')
const { SuccessResponse } = require('../messages/success.response')
const { AuthFailuredError } = require('../messages/error.response')

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

  static loginOpenAuth = async (req, res, next) => {
    const { id } = req.body
    try {
      if (!id) {
        throw new AuthFailuredError('Missing input')
      }
      new SuccessResponse({
        message: 'Login with google successfuly',
        metadata: await AuthService.loginOpenAuth(id)
      }).send(res)
    } catch (error) {
      return error
    }
  }

  static logOut = async (req, res, next) => {
    const { email } = req.user
    new SuccessResponse({
      message: 'Logout Successfully',
      metadata: await AuthService.logOut(email)
    }).send(res)
  }
}

module.exports = AuthController
