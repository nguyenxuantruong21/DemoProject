const JWT = require('jsonwebtoken')

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

module.exports = {
  createTokenPair
}
