import express from 'express';
import { registerUser, logInUser } from '../controllers/authController';
import validateRegistration from '../helpers/validate';
import { ensureAuthenticated } from '../helpers/auth';

const router = express.Router();

// User Register - {"firstName":"Jon","lastName":"Snow","email":"jon.snow@gmail.com","password":"testing","password2":"testing"}
router.post('/', validateRegistration, registerUser);

// JSON Webtoken Version - {"email":"zshah011@uottawa.ca","password":"testing"}
router.post('/login', logInUser);

// Verify a Token - no body, header bearer with token
router.get('/verifyToken', ensureAuthenticated, (req, res) => {
  res.json({ message: 'Token Verified.' });
});

export default router;
