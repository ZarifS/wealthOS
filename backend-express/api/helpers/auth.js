import jwt from 'jsonwebtoken'
import { WEB_TOKEN_SECRET } from '../secrets'

// Lock resource if not authenticated
export const ensureAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, WEB_TOKEN_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    })
  }
}

// Create a secure JSON WebToken
export const createToken = payload => {
  return jwt.sign(payload, WEB_TOKEN_SECRET, {
    expiresIn: '1h'
  })
}
