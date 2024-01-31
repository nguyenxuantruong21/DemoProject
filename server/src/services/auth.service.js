const bcrypt = require('bcrypt')
const { config } = require('dotenv')
const { BadRequestError, AuthFailuredError } = require('../messages/error.response')
const { createTokenPair } = require('../utils/jwt')
const { getSelectData, formatDate } = require('../utils/index')
const db = require('../models/index')
const { Roles } = require('../config/roles')
config()

class AuthService {
  static register = async ({ name, email, date, password }) => {
    // 1 check shop
    const foundUser = await db.User.findOne({
      where: { email }
    })
    if (foundUser) {
      throw new BadRequestError('Error:: Shop already register !!!')
    }
    // 2 hash password
    const hashPassword = await bcrypt.hash(password, 10)
    const dateFormat = formatDate(date)
    const response = await db.User.create({
      name,
      email,
      date: dateFormat,
      password: hashPassword
    })
    // 3 sign token
    if (response) {
      const tokens = await createTokenPair(
        {
          id: response.id,
          name: response.name,
          email: response.email,
          date: response.date,
          password: response.password
        },
        process.env.PUBLIC_KEY,
        process.env.PRIVATE_KEY
      )
      return {
        user: getSelectData(response, ['name', 'email']),
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
    const response = await db.User.findOne({
      where: { email }
    })
    if (!response) {
      throw new BadRequestError('Email is not register')
    }
    // 2 check password
    const match = bcrypt.compareSync(password, response.password)
    if (!match) {
      throw new AuthFailuredError('Authorization error')
    }
    // 3 create token
    const tokens = await createTokenPair(
      {
        id: response.id,
        name: response.name,
        email: response.email,
        date: response.date,
        password: response.password
      },
      process.env.PUBLIC_KEY,
      process.env.PRIVATE_KEY
    )
    /*
     find in database KeyToken {email} -> yes -> update -> refreshToken 
     find in database KeyToken {email} -> no -> creat new  -> refreshToken 
    */
    const [_, created] = await db.KeyToken.findOrCreate({
      where: { user_email: email },
      defaults: {
        user_email: email,
        refreshToken: tokens.refreshToken
      }
    })
    if (!created) {
      await db.KeyToken.update(
        {
          refreshToken: tokens.refreshToken,
          user_email: email
        },
        { where: { user_email: email } }
      )
    }
    return {
      user: getSelectData(response, ['name', 'email']),
      tokens
    }
  }

  static loginOpenAuth = async (id) => {
    try {
      const response = await db.OpenAuth.findOne({
        where: { id },
        raw: true
      })
      const tokens = await createTokenPair(
        {
          id: response.id,
          name: response.name,
          email: response.email,
          password: response.password
        },
        process.env.PUBLIC_KEY,
        process.env.PRIVATE_KEY
      )
      const [_, created] = await db.KeyToken.findOrCreate({
        where: { user_email: response.email },
        defaults: {
          user_email: response.email,
          refreshToken: tokens.refreshToken
        }
      })
      if (!created) {
        await db.KeyToken.update(
          {
            refreshToken: tokens.refreshToken,
            user_email: response.email
          },
          { where: { user_email: response.email } }
        )
      }
      return tokens
    } catch (error) {
      return error
    }
  }

  static logOut = async (email) => {
    return await db.KeyToken.destroy({
      where: { user_email: email }
    })
  }
}

module.exports = AuthService
