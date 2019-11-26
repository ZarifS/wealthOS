import UserModel from '../models/userModel';
import { createToken } from '../helpers/auth';

// Register a new user
export const registerUser = (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Register the new user
  const newUser = new UserModel({
    firstName,
    lastName,
    email,
    password,
    links: new Map(),
    accounts: new Map(),
    budget: 0,
    holdings: 0
  });

  // Save to DB
  newUser
    .save()
    .then(user => {
      return res.status(201).json({
        message: 'User created.',
        userId: user.id
      });
    })
    .catch(err => {
      return res.status(400).json({ message: err.message });
    });
};

// Authenticate a user
export const logInUser = (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email })
    .then(user => {
      // No user found
      if (!user) {
        throw new Error('User not found.');
      }

      // Incorrect Password
      if (!user.checkPassword(password)) {
        throw new Error('Credentials do not match.');
      }

      // Verified User
      const payload = {
        id: user.id
      };

      // Create JSON Webtoken
      return createToken(payload);
    })
    .then(token => {
      return res.status(200).json({
        message: 'Auth successful.',
        token
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(400).json({ message: err.message });
    });
};
