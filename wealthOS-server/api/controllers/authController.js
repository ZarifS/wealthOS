import UserModel from '../models/userModel';
import { createToken } from '../helpers/auth';

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    // Make email entries uniform
    const email = req.body.email.toLowerCase();
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
    const user = await newUser.save();
    return res.status(201).json({
      message: 'User created.',
      userId: user.id
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Authenticate a user
export const logInUser = async (req, res) => {
  try {
    const { password } = req.body;
    // Make email entries uniform
    const email = req.body.email.toLowerCase();
    const user = await UserModel.findOne({ email });
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
    const token = createToken(payload);
    return res.status(200).json({
      message: 'Auth successful.',
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
