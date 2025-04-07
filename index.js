require('dotenv').config();
const express = require('express');
const bot = require('./bot');
const app = express();

// Middleware
app.use(express.json());

// Set webhook
if (process.env.NODE_ENV === 'production') {
  const webhookUrl = `${process.env.WEBHOOK_URL}/bot${process.env.TELEGRAM_TOKEN}`;
  app.use(bot.webhookCallback(`/bot${process.env.TELEGRAM_TOKEN}`));
  bot.telegram.setWebhook(webhookUrl)
    .then(() => console.log('Webhook set successfully'))
    .catch(err => console.error('Error setting webhook:', err));
} else {
  bot.launch();
  console.log('Bot running in development mode');
}

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Bot is running' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Enable graceful stop
process.once('SIGINT', () => {
  try {
    bot.stop('SIGINT');
  } catch (e) {
    console.log('Bot already stopped');
  }
  process.exit(0);
});

process.once('SIGTERM', () => {
  try {
    bot.stop('SIGTERM');
  } catch (e) {
    console.log('Bot already stopped');
  }
  process.exit(0);
});
