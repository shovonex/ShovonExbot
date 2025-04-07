# Female Telegram Bot

A human-like conversational bot with model and pricing information.

## Features
- Natural language conversation
- Interactive menu with InlineKeyboard
- Model and pricing display from JSON data
- Automatic webhook configuration
- Error handling and logging

## Setup Instructions

1. Get your Telegram bot token from [@BotFather](https://t.me/BotFather)
2. Clone this repository
3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file with:
```bash
TELEGRAM_TOKEN=your_bot_token_here
```

## Deployment to Render

1. Push your code to a GitHub repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set environment variables:
   - `TELEGRAM_TOKEN`: Your bot token
5. Configure these settings:
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
   - Port: 8000

## Webhook Configuration
The bot automatically sets up the webhook to:
```bash
https://russ-bot.onrender.com/webhook
```

## Local Development
For testing with polling:
```bash
python bot.py
```

For webhook testing:
```bash
python app.py
```

## Troubleshooting
If you encounter issues:
- Verify port 8000 is set in Render
- Check TELEGRAM_TOKEN is correct
- Review logs for errors
- Test locally first

## Bot Commands
- `/start` - Begin interaction
- `/menu` - Return to main menu
- Chat naturally in conversation mode
