var GoogleStrategy = require('passport-google-oauth2').Strategy
const { config } = require('dotenv')
const passport = require('passport')
const db = require('../models/index')
config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      passReqToCallback: true
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        if (profile?.id) {
          await db.OpenAuth.findOrCreate({
            where: { id: profile.id },
            defaults: {
              id: profile.id,
              name: profile.displayName,
              email: profile.email
            }
          })
        }
        return done(null, profile)
      } catch (error) {
        console.log(error)
      }
      return done(null, profile)
    }
  )
)
