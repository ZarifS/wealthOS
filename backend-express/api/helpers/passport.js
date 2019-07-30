import passport from 'passport-local'
import UserModel from '../models/userModel'

// Define local strategy
const LocalStrategy = passport.Strategy

export default function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      UserModel.findOne({ email: email })
        .then(user => {
          // No user found
          if (!user) {
            return done(null, false, { message: 'That email is not registered' })
          }
          // Verify Password
          if (!user.checkPassword(password)) {
            return done(null, false, { message: 'Incorrect password' })
          }
          return done(null, user)
        })
        .catch(err => {
          console.log('Error: ' + err)
          throw err
        })
    })
  )

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    UserModel.findById(id, function(err, user) {
      done(err, user)
    })
  })
}
