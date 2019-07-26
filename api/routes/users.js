import express from 'express'
const router = express.Router()

// Login Page
router.get('/login', (req, res) => {
  res.render('login')
})

// Register Page
router.get('/register', (req, res) => {
  res.render('register')
})

// User Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
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

  // Send back error messages to partials/messages.ejs
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  }
  // Encrypt Password, Add User to MongoDB
  else res.send('Ok')
})

export default router
