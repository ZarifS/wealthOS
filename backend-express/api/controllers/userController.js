import { exchangeToken, getAccounts } from '../controllers/plaidController'
import ItemModel from '../models/itemModel'

// Create a new item to store in Item db
export const linkItemToUser = (req, res) => {
  let { institutionName } = req.body
  let { itemId } = req.user.links.get(institutionName)
  let item = new ItemModel({
    itemId: itemId,
    users: [req.user.id]
  })
  // Save to DB
  item
    .save()
    .then(item => {
      res.status(201).json({
        message: 'Item created.',
        item: item
      })
    })
    .catch(err => {
      res.status(400).send({ message: err.message })
    })
}

// Set up bank linking to user profile
export const linkPlaidToUser = (req, res) => {
  // Grab public token from body
  let { publicToken, institutionName } = req.body
  let user = req.user
  // Exchange Token
  exchangeToken(publicToken)
    .then(token => {
      let { access_token, item_id } = token
      user.links.set(institutionName, { accessToken: access_token, itemId: item_id })
      return user.save()
    })
    .then(user => {
      return res.status(200).json({
        message: 'Added Link Successfully',
        userId: user.id
      })
    })
    .catch(err => {
      return res.status(400).json([{ message: err.message }])
    })
}

// Add bank accounts to user profile
export const initAccounts = (req, res) => {
  let { institutionName } = req.body
  let { accessToken } = req.user.links.get(institutionName)

  // Pull accounts for the Item
  getAccounts(accessToken)
    .then(accounts => {
      let user = setUserAccounts(req.user, accounts, institutionName)
      return user.save()
    })
    .then(user => {
      res.status(200).json({
        message: 'Initialized User Accounts',
        user: user.id
      })
    })
    .catch(err => {
      return res.status(400).json([{ message: err.message }])
    })
}

// Add new institution accounts to the User
const setUserAccounts = (user, accounts, institutionName) => {
  // Setup user accounts for each account associated with the Plaid item
  accounts.forEach(account => {
    let { account_id, balances, name, type } = account
    let newAccount = {
      name: name,
      balance: balances.current,
      type: type,
      institutionName: institutionName,
      currency: balances.iso_currency_code
    }
    user.accounts.set(account_id, newAccount)
  })

  // Recalculate the users current balance
  user.balance = calculateUserBalance(user.accounts)

  return user
}

// Whenever accounts are modified, update.
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
