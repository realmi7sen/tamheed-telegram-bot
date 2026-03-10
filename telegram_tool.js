const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// 1. إعدادات التليجرام
const TOKEN = "توكن_بوتك_هنا";
const CHAT_ID = "@tmheeeed"; 
const bot = new TelegramBot(TOKEN, { polling: true });

// 2. إنشاء سيرفر لاستقبال بيانات سلة (Webhook)
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        
        // التحقق من نوع الحدث (طلب جديد)
        if (data.event === 'order.created') {
          const order = data.data;
          const customerName = order.customer.first_name + ' ' + order.customer.last_name;
          const total = order.amounts.total.amount;
          const currency = order.amounts.total.currency;

          const message = `🔔 *طلب جديد في تمهيد!* 🚀\n\n` +
                          `👤 العميل: ${customerName}\n` +
                          `💰 المبلغ: ${total} ${currency}\n` +
                          `📦 حالة الطلب: ${order.status.name}`;

          bot.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });
        }
        
        res.writeHead(200);
        res.end('OK');
      } catch (err) {
        res.writeHead(400);
        res.end('Error');
      }
    });
  } else {
    res.writeHead(200);
    res.end('Bot is running...');
  }
});

// تشغيل السيرفر على البورت اللي يعطينا إياه Render
server.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening for Salla Webhooks!');
});

// رسالة ترحيبية للبوت
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "مرحباً! أنا مساعد تمهيد الذكي. سأقوم بإرسال إشعارات المبيعات للقناة آلياً 🚀");
});
