from flask import Flask, request
from telegram_bot.bot import main
import os

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    """Handle incoming Telegram updates"""
    update = request.get_json()
    main(update)
    return 'OK', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
