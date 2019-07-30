import { Strategy, ExtractJwt } from 'passport-jwt'
import { webTokenSecret } from '../secrets'
import UserModel from '../models/userModel'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: webTokenSecret
}

// Utilize the JWT Strategy to verify token
export default function(passport) {
  passport.use(
    new Strategy(opts, (payload, done) => {
      UserModel.findById(payload.id)
        .then(user => {
          if (user) {
            return done(null, user)
          }
          return done(null, false)
        })
        .catch(err => console.error(err))
    })
  )
}
