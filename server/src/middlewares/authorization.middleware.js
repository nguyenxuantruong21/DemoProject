const JWT = require('jsonwebtoken')
const { config } = require('dotenv')
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

module.exports = {
  Authorization
}
