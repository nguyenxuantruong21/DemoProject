const JWT = require('jsonwebtoken')
const { config } = require('dotenv')
config()

const createTokenPair = async (payload, publickey, privatekey) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, publickey, {
      expiresIn: '2 days'
    })

    // refresh token
    const refreshToken = await JWT.sign(payload, privatekey, {
      expiresIn: '7 days'
    })

    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`
    }
  } catch (error) {
    return error
  }
}

const verifyRefreshToken = (refreshToken) => {
  const token = refreshToken.split(' ')[1]
  return JWT.verify(token, process.env.PRIVATE_KEY)
}

module.exports = {
  createTokenPair,
  verifyRefreshToken
}
