import UserModel from '../models/userModel';

// Middleware to validate the registration credentials for a user
export const validateRegistration = async (req, res, next) => {
  const { firstName, lastName, email, password, password2 } = req.body;

  const errors = [];

  // Basic user validation - change to 3rd party later
  if (!firstName || !lastName || !email || !password || !password2) {
    errors.push({ message: 'Please enter all fields.' });
  } else if (password !== password2) {
    errors.push({ message: 'Passwords do not match.' });
  } else if (password.length < 6) {
    errors.push({ message: 'Password must be at least 6 characters.' });
  }

  // User Validation
  const user = await UserModel.exists({ email });

  // User already exists
  if (user) {
    errors.push({ message: 'Email is already registered.' });
  }

  // Send back error messages
  if (errors.length > 0) {
    res.status(401);
    return res.json(errors);
  }

  // Continue if there is no errors
  next();
};
