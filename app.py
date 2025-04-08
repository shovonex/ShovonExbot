from flask import Flask, request
from bot import main
import os

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    """Handle incoming updates from Telegram"""
    update = request.get_json()
    main(update)
    return 'OK', 200

def set_webhook():
    from telegram import Bot
    bot = Bot(token=os.getenv('TELEGRAM_TOKEN'))
    bot.set_webhook(url='https://russ-bot.onrender.com/webhook')

if __name__ == '__main__':
    set_webhook()
    app.run(host='0.0.0.0', port=8000)
