import { addWebhook, fireTransactionWebhook } from '../controllers/plaidController'

export const addWebhookToUser = (req, res) => {
  let { institutionName } = req.body
  let { accessToken } = req.user.links.get(institutionName)
  addWebhook(accessToken).then(item => {
    console.log(item)
    res.status(200).json({
      message: 'Updated Webhook Successfully'
    })
  })
}
export const fireWebhook = async (req, res) => {
  let { institutionName } = req.body
  let { accessToken } = req.user.links.get(institutionName)
  fireTransactionWebhook(accessToken)
  res.status(200).json({
    message: 'Fired Webhook Successfully'
  })
}
