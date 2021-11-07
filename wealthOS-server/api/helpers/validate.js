import UserModel from '../models/userModel'

// Middleware to validate the registration credentials for a user
export default async (req, res, next) => {
  const { firstName, lastName, password, password2 } = req.body
  let { email } = req.body
  email = email.toLowerCase()
  const errors = []

  // Basic user validation - change to 3rd party later
  if (!firstName || !lastName || !email || !password || !password2) {
    errors.push({ message: 'Please enter all fields.' })
  } else if (password !== password2) {
    errors.push({ message: 'Passwords do not match.' })
  } else if (password.length < 6) {
    errors.push({ message: 'Password must be at least 6 characters.' })
  }

  // User Validation
  const user = await UserModel.exists({ email })
  // User already exists
  if (user) {
    console.log('User already exists')
    errors.push({ message: 'Email is already registered.' })
  }

  // Send back error messages
  if (errors.length > 0) {
    return res.status(401).json(errors)
  }

  // Continue if there is no errors
  return next()
}
