const express = require('express');
const WebPush = require('web-push');
require('dotenv').config()
const app = express();

// configure app to receive JSON data
app.use(express.json());

const PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY;
const PRIVATE_VAPID_KEY = process.env.PRIVATE_VAPID_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT;
const PORT = process.env.PORT || 3001;

WebPush.setVapidDetails(VAPID_SUBJECT, PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

const subscriptions = [];

app.use((req, res, next) => {
  // add Access-Control-Allow-Origin header to the response
  res.setHeader('Access-Control-Allow-Origin', '*');
  // add Access-Control-Allow-Headers header to the response
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/push/get-vapid-public-key', (req, res) => {
  res.send(PUBLIC_VAPID_KEY);
});

app.post('/push/subscribe', (req, res) => {
  const subscription = req.body;
  const alreadyExists = subscriptions.find(sub => sub.endpoint === subscription.endpoint);
  if (alreadyExists) {
    console.log("Subscriptions list:", subscriptions);
    return res.status(201).send();
  }
  subscriptions.push(subscription);
  console.log("Subscriptions list:", subscriptions);
  res.status(201).send();
});

app.post('/push/send-notification-to-list', (req, res) => {

  const { subscriptionList, title, body } = req.body;
  const notificationPayload = {
    notification: {
      title,
      body,
    }
  };

  const payload = JSON.stringify(notificationPayload);

  const promises = subscriptionList.map(subscription => {
    return WebPush.sendNotification(subscription, payload)
  });

  Promise.all(promises)
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.post('/push/broadcast', (req, res) => {

  const { title, body } = req.body;
  const notificationPayload = {
    notification: {
      title,
      body,
    }
  };

  const payload = JSON.stringify(notificationPayload);

  const promises = subscriptions.map(subscription => {
    return WebPush.sendNotification(subscription, payload)
  });

  Promise.allSettled(promises)
    .then((response) => {
      const shouldUnsubscribe = response.filter(res => res.status === 'rejected');
      shouldUnsubscribe.forEach(sub => {
        const index = subscriptions.findIndex(s => s.endpoint === sub.reason.endpoint);
        subscriptions.splice(index, 1);
      });
      res.status(200).send();
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});