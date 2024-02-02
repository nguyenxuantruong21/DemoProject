const bcrypt = require('bcrypt')
const { config } = require('dotenv')
const { BadRequestError, AuthFailuredError } = require('../messages/error.response')
const { createTokenPair, verifyRefreshToken } = require('../utils/jwt')
const { getSelectData, formatDate } = require('../utils/index')
const db = require('../models/index')
config()

class AuthService {
  /**
   * @param {name}
   * @param {email}
   * @param {date}
   * @param {password}
   * @returns {user, token}
   */
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
          email: response.email
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

  /**
   * @param {email}
   * @param {password}
   * @returns {user, token}
   */

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
        email: response.email
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

  /**
   * @param {google}
   * @returns {user, token}
   */
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
          email: response.email
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

  /**
   * @param {email}
   * @returns {DELETE}
   */
  static logOut = async (email) => {
    return await db.KeyToken.destroy({
      where: { user_email: email }
    })
  }

  /**
   * @param {id}
   * @returns {user}
   */
  static getMe = async (id) => {
    try {
      const response = await db.User.findOne({
        where: { id },
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
      })
      return response.dataValues
    } catch (error) {
      return error
    }
  }

  /**
   *
   * @param {id}
   * @param {name}
   * @param {email}
   * @returns {tokens}
   */
  static refreshToken = async (refreshToken) => {
    try {
      const foundToken = await db.KeyToken.findOne({
        where: { refreshToken: refreshToken }
      })
      if (!foundToken) {
        return {
          message: 'Token invalide'
        }
      }
      const { id, name, email } = verifyRefreshToken(refreshToken)
      const tokens = await createTokenPair(
        {
          id: id,
          name: name,
          email: email
        },
        process.env.PUBLIC_KEY,
        process.env.PRIVATE_KEY
      )
      await db.KeyToken.update(
        {
          refreshToken: tokens.refreshToken,
          user_email: email
        },
        { where: { user_email: email } }
      )
      return {
        tokens
      }
    } catch (error) {
      return error
    }
  }

  
}

module.exports = AuthService
