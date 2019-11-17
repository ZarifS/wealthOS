import ngrok from 'ngrok';
import { addWebhook, fireTransactionWebhook } from './plaidController';

export const addWebhookToUser = (req, res) => {
  const { institutionName } = req.body;
  const { accessToken } = req.user.links.get(institutionName);
  // Development Server, close all Tunnels, connect ->  Tunnel Connection for Webhook Testing
  ngrok
    .kill()
    .then(() => {
      console.log('Disconnected from all tunnels. Reconnecting now..');
      return ngrok.connect(5000);
    })
    .then(url => {
      const webhookURL = `${url}/webhook/`;
      console.log('Connected to Tunnel at:', webhookURL);
      return addWebhook(accessToken, webhookURL);
    })
    .then(() => {
      res.status(200).json({
        message: 'Updated Webhook Successfully'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ message: err.message });
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
