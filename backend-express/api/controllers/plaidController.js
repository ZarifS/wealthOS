import plaid from 'plaid'
import moment from 'moment'
import { PLAID_CLIENT_ID, PLAID_PUBLIC_KEY, PLAID_SECRET, PLAID_ENV } from '../helpers/secrets'

// Initialize the Plaid client
const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
)

// Sandbox create a new public token
export const createPublicToken = (req, res) => {
  // CIBC
  let institutionId = 'ins_37'
  client
    .sandboxPublicTokenCreate(institutionId, ['transactions'])
    .then(token => {
      return res.status(200).json({
        publicToken: token.public_token
      })
    })
    .catch(err => {
      res.status(400).json([{ message: error.message }])
    })
}

// Manually add a webhook URL to a existing linked item
export const addWebhook = accessToken => {
  return client.updateItemWebhook(accessToken, 'https://enhay4am0y9l9.x.pipedream.net')
}

// Manually fire a webhook update to a linked item
export const fireTransactionWebhook = accessToken => {
  return client.sandboxItemFireWebhook(accessToken, 'DEFAULT_UPDATE', function() {
    console.log('Fired Webhook!')
  })
}

// Exchange public token
export const exchangeToken = publicToken => {
  return client.exchangePublicToken(publicToken)
}

// Makes a call to the Plaids Transactions API for a given Item/Institution
export const getTransactions = async (accessToken, startDate, endDate) => {
  try {
    let { transactions } = await client.getTransactions(accessToken, startDate, endDate)
    return transactions
  } catch (error) {
    throw error
  }
}

// Makes a call to the Plaids Transactions API for Account information for a given Item/Institution
export const getAccounts = async accessToken => {
  // Last 30 Days
  let startDate = moment()
    .subtract(1, 'days')
    .format('YYYY-MM-DD')
  let endDate = moment().format('YYYY-MM-DD')

  // Call Plaid API Transactions
  try {
    let { accounts } = await client.getTransactions(accessToken, startDate, endDate, {
      count: 1,
      offset: 0
    })
    return accounts
  } catch (error) {
    throw error
  }
}
