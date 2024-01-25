const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const { config } = require('dotenv')
config()

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
      secretOrKey: process.env.PUBLIC_KEY
    },
    (payload, done) => {
      try {
        console.log('payload:::::::::', payload)
      } catch (error) {
        console.log('error:::::::::::::', error)
      }
    }
  )
)
