import jwt from 'jsonwebtoken'
import { webTokenSecret } from '../secrets'

// Lock resource if not authenticated
export const ensureAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, webTokenSecret)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    })
  }
}

export const createToken = payload => {
  return jwt.sign(payload, webTokenSecret, {
    expiresIn: '1h'
  })
}
