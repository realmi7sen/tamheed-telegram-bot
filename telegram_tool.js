// هذا الكود الصغير عشان يخلي سيرفر Render ما يطفي البوت
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running\n');
}).listen(process.env.PORT || 3000);

const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "8788176562:AAHxxwA7yDjxm2GvPZylIb6iAHnamnZWfDo";
const CHAT_ID = "@tmheeeed";

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "مرحبا! أنا بوتك. اكتب أي رسالة وسأرسلها للقناة.",
  );
});

bot.on("message", (msg) => {
  if (msg.text && !msg.text.startsWith("/")) {
    bot
      .sendMessage(CHAT_ID, msg.text)
      .then(() => {
        bot.sendMessage(msg.chat.id, "✅ تم إرسال الرسالة للقناة");
      })
      .catch((err) => {
        bot.sendMessage(msg.chat.id, "❌ حصل خطأ: " + err.message);
      });
  }
});

console.log("البوت يعمل الآن...");

