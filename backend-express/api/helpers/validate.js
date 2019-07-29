import UserModel from '../models/userModel'

// Validate the registration credentials for a user
export const validateRegistration = async userInput => {
  const { name, email, password, password2 } = userInput
  let errors = []

  // Basic user validation - change to 3rd party later
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' })
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' })
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' })
  }

  // User Validation
  let user = await UserModel.exists({ email: email })

  // User already exists
  if (user) {
    errors.push({ msg: 'Email is already registered.' })
  }
  // Send back error messages
  return errors
}
