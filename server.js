const cors = require('cors');
const next = require('next');
const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const Sentiment = require('sentiment');
//!== 'production'
const dev = process.env.NODE_ENV;
const port = process.env.PORT || 3000;

const app = next({ dev });
const handler = app.getRequestHandler();
const sentiment = new Sentiment();

// Ensure that your pusher credentials are properly set in the .env file
// Using the specified variables
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true
});

app.prepare()
  .then(() => {

    const server = express();

    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    const chatHistory = { messages: [] };
    const onlineusers = [];

    server.post('/message', (req, res, next) => {
      console.log(JSON.stringify(req.body));
      const { user = null, message = '', timestamp = +new Date } = req.body;
      const sentimentScore = sentiment.analyze(message).score;

      const chat = { user, message, timestamp, sentiment: sentimentScore };

      chatHistory.messages.push(chat);
      pusher.trigger('chat-room', 'new-message', { chat });
    });

    server.post('/user', (req, res, next) => {
      console.log(JSON.stringify(req.body));
      const data = req.body;
      console.log('user:', data);
      onlineusers.push(data.user);
      console.log('...');
      console.log(onlineusers)
      pusher.trigger('chat-room', 'new-user', data);
      res.json({status: "success"})
    })

    server.get('/users', (req, res, next) => {
      res.json({ users: [...onlineusers], status: 'success' });
    });

    server.get('/messages', (req, res, next) => {
      res.json({ ...chatHistory, status: 'success' });
    });

    server.get('*', (req, res) => {
      return handler(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });

  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });