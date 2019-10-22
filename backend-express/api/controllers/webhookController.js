import { addWebhook, fireTransactionWebhook } from './plaidController';

export const addWebhookToUser = (req, res) => {
  const { institutionName } = req.body;
  const { accessToken } = req.user.links.get(institutionName);
  addWebhook(accessToken).then((item) => {
    console.log(item);
    res.status(200).json({
      message: 'Updated Webhook Successfully'
    });
  });
};
export const fireWebhook = async (req, res) => {
  const { institutionName } = req.body;
  const { accessToken } = req.user.links.get(institutionName);
  fireTransactionWebhook(accessToken);
  res.status(200).json({
    message: 'Fired Webhook Successfully'
  });
};
