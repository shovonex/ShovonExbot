const { Telegraf, Markup } = require('telegraf');
const models = require('./data/models.json');

// Female persona responses
const FEMALE_RESPONSES = {
  greeting: "👋 Hello darling! I'm Clara, your virtual assistant. How can I help you today?",
  unknown: "💁‍♀️ I'm not sure I understand, sweetie. Could you rephrase that?",
  goodbye: "💋 It was lovely chatting with you! Come back anytime!",
  joke: "Why don't scientists trust atoms? Because they make up everything! 😄",
  pricing: "Here are our beautiful options, sweetheart:"
};

// Initialize bot
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Welcome command
bot.start((ctx) => {
  return ctx.replyWithMarkdown(FEMALE_RESPONSES.greeting, 
    Markup.keyboard([
      ['💎 View Models & Pricing', '💬 Chat with me'],
      ['❓ Help', '👋 Goodbye']
    ]).resize()
  );
});

// Pricing command
bot.hears('💎 View Models & Pricing', (ctx) => {
  let message = `${FEMALE_RESPONSES.pricing}\n\n`;
  
  models.models.forEach(model => {
    message += `*${model.name}* - ${model.price}\n${model.description}\n\n`;
  });

  ctx.replyWithMarkdown(message, 
    Markup.inlineKeyboard(
      models.models.map(model => [
        Markup.button.callback(model.name, `select_${model.name.replace(/\s+/g, '_')}`)
      ])
    )
  );
});

// Handle model selection
models.models.forEach(model => {
  const action = `select_${model.name.replace(/\s+/g, '_')}`;
  bot.action(action, (ctx) => {
    ctx.answerCbQuery();
    ctx.replyWithPhoto(
      { url: model.image },
      { caption: `💖 *${model.name}* 💖\n\n💰 Price: ${model.price}\n📝 ${model.description}\n\nShall I help you purchase this package, darling?`,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          Markup.button.callback('Yes please!', 'confirm_purchase'),
          Markup.button.callback('Show other options', 'show_options')
        ])
      }
    );
  });
});

// Purchase confirmation
bot.action('confirm_purchase', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('Wonderful choice! Please send /contact to connect with our team for payment 💳');
});

// Show options again
bot.action('show_options', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('Of course! Let me show you our options again...');
  ctx.reply(FEMALE_RESPONSES.pricing, 
    Markup.inlineKeyboard(
      models.models.map(model => [
        Markup.button.callback(model.name, `select_${model.name.replace(/\s+/g, '_')}`)
      ])
    )
  );
});

// Fallback for unknown messages
bot.on('text', (ctx) => {
  if (!['start', 'help', 'goodbye'].includes(ctx.message.text.toLowerCase())) {
    return ctx.reply(FEMALE_RESPONSES.unknown);
  }
});

// Goodbye command
bot.hears('👋 Goodbye', (ctx) => {
  return ctx.reply(FEMALE_RESPONSES.goodbye);
});

module.exports = bot;