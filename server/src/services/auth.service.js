const bcrypt = require('bcrypt')
const { config } = require('dotenv')
const { BadRequestError, AuthFailuredError } = require('../messages/error.response')
const { createTokenPair } = require('../utils/jwt')
const { getSelectData } = require('../utils/index')
const db = require('../models/index')
config()

class AuthService {
  static register = async ({ name, email, password }) => {
    // 1 check shop
    const foundUser = await db.User.findOne({
      where: { email }
    })
    if (foundUser) {
      throw new BadRequestError('Error:: Shop already register !!!')
    }
    // 2 hash password
    const hashPassword = await bcrypt.hash(password, 10)
    const findUser = await db.User.create({
      name,
      email,
      password: hashPassword
    })
    // 3 sign token
    if (findUser) {
      const tokens = await createTokenPair(
        {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          password: findUser.password
        },
        process.env.PUBLIC_KEY,
        process.env.PRIVATE_KEY
      )
      return {
        user: getSelectData(findUser, ['name', 'email']),
        tokens
      }
    }
    return {
      code: 200,
      metadata: null
    }
  }

  static login = async ({ email, password }) => {
    // 1 check email
    const findUser = await db.User.findOne({
      where: { email }
    })
    if (!findUser) {
      throw new BadRequestError('Email is not register')
    }
    // 2 check password
    const match = bcrypt.compareSync(password, findUser.password)
    if (!match) {
      throw new AuthFailuredError('Authorization error')
    }
    // 3 create token
    const tokens = await createTokenPair(
      {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        password: findUser.password
      },
      process.env.PUBLIC_KEY,
      process.env.PRIVATE_KEY
    )

    return {
      user: getSelectData(findUser, ['name', 'email']),
      tokens
    }
  }

  static logout = async () => {}
}

module.exports = AuthService
