# Female Telegram Bot

A human-like conversational bot with model and pricing information.

## Features
- Natural language conversation using ChatterBot
- Interactive menu with InlineKeyboard
- Model and pricing display from JSON data
- Webhook support for Render deployment
- Error handling and logging

## Setup Instructions

1. Get your Telegram bot token from [@BotFather](https://t.me/BotFather)
2. Clone this repository
3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```bash
TELEGRAM_TOKEN=your_bot_token_here
```

## Deployment to Render

1. Push your code to a GitHub repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set environment variables:
   - `TELEGRAM_TOKEN`: Your bot token
   - `PORT`: 8000 (or your preferred port)
5. Set the build command:
```bash
pip install -r requirements.txt
```
6. Set the start command:
```bash
python app.py
```

## Webhook Setup

After deployment:
1. Set your webhook URL:
```bash
https://api.telegram.org/bot{TOKEN}/setWebhook?url={YOUR_RENDER_URL}/webhook
```

## Local Testing

For development, you can use polling mode:
```bash
python bot.py
```

For production, use the webhook server:
```bash
python app.py
```

## Bot Commands
- `/start` - Begin interaction
- `/menu` - Return to main menu
- Chat naturally in conversation mode
