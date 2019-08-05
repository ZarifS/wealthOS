import express from 'express'
import plaid from 'plaid'
import moment from 'moment'
import { PLAID_CLIENT_ID, PLAID_PUBLIC_KEY, PLAID_SECRET, PLAID_ENV } from '../secrets'

const router = express.Router()

// Initialize the Plaid client
const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
)

// Query all info on User
router.get('/', (req, res) => {
  let user = req.user
  user.password = undefined
  user.__v = undefined
  // Return user object
  res.status(200).json({
    user: user
  })
})

// Generate a public token for Sandbox Environment with CIBC
router.get('/getPublicToken', async (req, res) => {
  // CIBC
  let institution_id = 'ins_37'
  try {
    let { public_token } = await client.sandboxPublicTokenCreate(institution_id, ['transactions'])
    res.status(200).json({
      public_token: public_token
    })
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
})

// User Links Plaid
router.post('/link', (req, res) => {
  // Grab public token from body
  let { public_token, institution_name } = req.body
  // Exchange Token
  client
    .exchangePublicToken(public_token)
    .then(async token => {
      let { access_token, item_id } = token
      console.log(req.user)
      user.links = new Map()
      user.links.set(institution_name, { access_token: access_token, item_id: item_id })
      await user.save()
      return res.status(200).json({
        message: 'Added Link Successfully',
        access_token: access_token,
        item_id: item_id
      })
    })
    .catch(err => {
      console.log(err)
      return res.status(400).json({
        error: err.message
      })
    })
})

// Initialize accounts for a newly linked Item
router.post('/initAccounts', (req, res) => {
  let { institution_name } = req.body
  let { access_token } = req.user.links.get(institution_name)

  // Pull transactions for the Item for the last 30 days
  let startDate = moment()
    .subtract(30, 'days')
    .format('YYYY-MM-DD')
  let endDate = moment().format('YYYY-MM-DD')

  // Call Plaid API
  client
    .getTransactions(access_token, startDate, endDate, {
      count: 30,
      offset: 0
    })
    .then(transactionsResponse => {
      let { accounts } = transactionsResponse
      let user = initUserAccounts(req.user, accounts, institution_name)
      return user.save()
    })
    .then(doc => {
      res.status(200).json({
        message: 'Initialized User Accounts',
        user: doc
      })
    })
    .catch(err => {
      console.log(err)
      return res.status(400).json({
        error: err.message
      })
    })
})

// Add new institution accounts to the User
const initUserAccounts = (user, accounts, institution_name) => {
  // Initialize accounts Map
  if (user.accounts === undefined) {
    user.accounts = new Map()
  }
  if (user.balance === undefined) {
    user.balance = 0
  }
  // Setup user accounts for each account associated with the Plaid item
  accounts.forEach(account => {
    let { account_id, balances, name, type } = account
    let newAccount = {
      name: name,
      balance: balances.current,
      type: type,
      institution_name: institution_name,
      currency: balances.iso_currency_code
    }
    user.accounts.set(account_id, newAccount)
  })

  // Recalculate the users current balance
  user.balance = calculateUserBalance(user.accounts)

  return user
}

const calculateUserBalance = accounts => {
  let sum = 0
  accounts.forEach(account => {
    let { balance, type } = account
    if (type === 'depository') {
      sum = sum + balance
    } else if (type === 'credit') {
      sum = sum - balance
    }
  })
  return sum
}

export default router
