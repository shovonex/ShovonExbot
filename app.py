from flask import Flask, request
from bot import main

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    """Handle incoming updates from Telegram"""
    update = request.get_json()
    main(update)
    return 'OK', 200

if __name__ == '__main__':
    app.run(port=5000)
