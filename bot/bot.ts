import telegram from 'node-telegram-bot-api';

const bottoken = "6102811674:AAF0ApuaM08EphsYBB7hFFISx_TLUIhMJKs"
if (require.main === module) {
    const bot = new telegram(bottoken, { polling: true });
  

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello! This is your bot responding.');
});

bot.startPolling();}


// import { Telegraf } from 'telegraf';
// import {Configuration,OpenAI} from 'openai'

// const bot = new Telegraf('6102811674:AAF0ApuaM08EphsYBB7hFFISx_TLUIhMJKs'); 
// const openaitoken = "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"



// const config = new Configuration({
//     apiKey: openaitoken,
// });


// const openai = new OpenAIApi(config);
// bot.use((ctx) => {
//     ctx.reply("hi hungry bird");
// });

// bot.start((ctx)=>{
//     ctx.reply("The bot has Started")
// })


// bot.help((ctx)=>{
//     ctx.reply("How can i help u \n - /start\n - /help")
// })

// bot.launch();

// bot.on("messege",(msg) => {
//     const chatId = msg.chat.id;

//     const reply = await openai.
// })

// import { Telegraf } from 'telegraf';
// import { OpenAI } from 'openai'; 

// const bot = new Telegraf('6102811674:AAF0ApuaM08EphsYBB7hFFISx_TLUIhMJKs'); 
// const openaitoken = "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";

// const openai = new OpenAI({
//     apiKey: openaitoken,
// });

// const chatCompletion = await openai.chat.completions.create({
//     messages: [{ role: "user", content: "Say this is a test" }],
//     model: "gpt-3.5-turbo",
// });
