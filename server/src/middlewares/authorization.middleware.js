const JWT = require('jsonwebtoken')
const { config } = require('dotenv')
const db = require('../models')
const { Roles } = require('../config/roles.config')
config()

const Authorization = async (req, res, next) => {
  const accessToken = (req.headers.authorization || '').split(' ')[1]
  if (!accessToken) {
    return res.json({
      message: 'Authorization Invalid'
    })
  }
  JWT.verify(accessToken, process.env.PUBLIC_KEY, (err, decode) => {
    if (err) {
      return res.json({
        message: 'Authorization Fail'
      })
    }
    req.user = decode
  })
  return next()
}

const Permission = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(403).json({
      message: 'Permission denied'
    })
  }
  const { role_id } = await db.UserRole.findOne({ where: { user_id: userId } })
  if (!role_id) {
    return res.status(403).json({
      message: 'Permission denied'
    })
  }
  return next()
}

const isAdmin = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(403).json({
      message: 'Permission denied'
    })
  }
  const { role_id } = await db.UserRole.findOne({ where: { user_id: userId } })
  if (role_id !== Roles.admin) {
    return res.status(403).json({
      message: 'Require role is Admin'
    })
  }
  return next()
}

const isModerator = async (req, res, next) => {
  const userId = req.user.id
  if (!userId) {
    return res.status(403).json({
      message: 'Permission denied'
    })
  }
  const { role_id } = await db.UserRole.findOne({ where: { user_id: userId } })
  if (role_id !== Roles.admin && role_id !== Roles.moderator) {
    return res.status(403).json({
      message: 'Require role is Admin/Moderator'
    })
  }
  return next()
}

module.exports = {
  Authorization,
  Permission,
  isAdmin,
  isModerator
}
