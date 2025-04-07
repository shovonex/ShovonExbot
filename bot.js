import json
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters, ContextTypes
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
import os

# Initialize logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# Load models data
with open('models.json', 'r') as f:
    models_data = json.load(f)

# Initialize chatbot
chatbot = ChatBot('FemaleBot')
trainer = ChatterBotCorpusTrainer(chatbot)
trainer.train("chatterbot.corpus.english")

# Menu keyboards
def get_main_menu_keyboard():
    keyboard = [
        [InlineKeyboardButton("📋 View All Models", callback_data='models')],
        [InlineKeyboardButton("💰 Pricing Comparison", callback_data='pricing')],
        [InlineKeyboardButton("💬 Chat with me", callback_data='chat')]
    ]
    return InlineKeyboardMarkup(keyboard)

def get_models_keyboard():
    keyboard = []
    for model in models_data['models']:
        keyboard.append([InlineKeyboardButton(
            f"{model['name']} - {model['price']}", 
            callback_data=f"model_{model['id']}"
        )])
    keyboard.append([InlineKeyboardButton("🔙 Back to Menu", callback_data='menu')])
    return InlineKeyboardMarkup(keyboard)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Send welcome message with menu"""
    user = update.effective_user
    welcome_text = f"""
👋 Hello {user.first_name}! I'm Clara, your virtual assistant.
Here's what I can help you with:

• Browse our different models
• Compare pricing plans
• Chat with me naturally

How can I assist you today?
    """
    await update.message.reply_text(welcome_text, reply_markup=get_main_menu_keyboard())

async def show_models(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show model selection menu"""
    query = update.callback_query
    await query.answer()
    
    response = "🌟 Please select a model to view details:\n"
    await query.edit_message_text(response, reply_markup=get_models_keyboard(), parse_mode='HTML')

async def show_model_details(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show detailed information about a specific model"""
    query = update.callback_query
    await query.answer()
    
    model_id = query.data.split('_')[1]
    model = next(m for m in models_data['models'] if m['id'] == model_id)
    
    response = f"""
<b>{model['name']}</b> - {model['price']}

{model['description']}

<b>Features:</b>
{'\n'.join(['✓ ' + feature for feature in model['features']])}

<i>Would you like to know more about this model?</i>
    """
    
    keyboard = [
        [InlineKeyboardButton("🔙 Back to Models", callback_data='models')],
        [InlineKeyboardButton("💬 Chat About This", callback_data=f'chat_{model_id}')]
    ]
    
    await query.edit_message_text(
        response, 
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode='HTML'
    )

async def show_pricing(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show pricing information"""
    query = update.callback_query
    await query.answer()
    
    response = "💰 Our Pricing Plans:\n\n"
    for model in models_data['models']:
        response += f"<b>{model['name']}</b>: {model['price']}\n"
    
    response += "\n💡 All plans come with 24/7 support!"
    await query.edit_message_text(response, parse_mode='HTML')

async def handle_chat(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle natural language conversation"""
    if update.callback_query:
        query = update.callback_query
        await query.answer()
        await query.edit_message_text("💬 You're now in chat mode. Type /menu to return.")
    else:
        user_input = update.message.text
        response = chatbot.get_response(user_input)
        await update.message.reply_text(str(response))

async def menu(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Return to main menu"""
    await update.message.reply_text("Main Menu:", reply_markup=get_menu_keyboard())

def main():
    """Start the bot"""
    app = Application.builder().token(os.getenv('7337288205:AAFQvsdE-SDbJh6NkJ-uGBy1UOwu4F0a198')).build()
    
    # Add handlers
    app.add_handler(CommandHandler('start', start))
    app.add_handler(CommandHandler('menu', menu))
    app.add_handler(CallbackQueryHandler(show_models, pattern='^models$'))
    app.add_handler(CallbackQueryHandler(show_pricing, pattern='^pricing$'))
    app.add_handler(CallbackQueryHandler(show_model_details, pattern='^model_'))
    app.add_handler(CallbackQueryHandler(handle_chat, pattern='^chat'))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_chat))
    
    app.run_polling()

if __name__ == '__main__':
    main()
