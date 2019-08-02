import express from 'express'
import plaid from 'plaid'
import UserModel from '../models/userModel'
import { ensureAuthenticated } from '../helpers/auth'
import { PLAID_CLIENT_ID, PLAID_PUBLIC_KEY, PLAID_SECRET, PLAID_ENV } from '../secrets'

const router = express.Router()

// Initialize the Plaid client
const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
)

// User Link Plaid
router.post('/link', ensureAuthenticated, (req, res) => {
  // Grab public token from body
  let { public_token, institution_name } = req.body
  // Exchange Token
  client
    .exchangePublicToken(public_token)
    .then(async token => {
      let { access_token, item_id } = token
      console.log(req.user)
      let user = await UserModel.findById(req.user.id)
      console.log(user)
      user.links = new Map()
      user.links.set(institution_name, { access_token: access_token, item_id: item_id })
      await user.save()
      return res.status(200).json({
        message: 'Added Link Successfully'
      })
    })
    .catch(err => {
      console.log(err)
      return res.status(400).json({
        error: err.message
      })
    })
})

export default router
