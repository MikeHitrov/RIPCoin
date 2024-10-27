const TelegramBot = require('node-telegram-bot-api');
const { TwitterApi } = require('twitter-api-v2');
const { Configuration, OpenAIApi } = require('openai');

// Replace with your own tokens
const telegramToken = 'YOUR_TELEGRAM_BOT_TOKEN';
const telegramChatId = 'YOUR_CHANNEL_CHAT_ID'; // Use @channelusername format for channels

const twitterClient = new TwitterApi({
    appKey: 'YOUR_TWITTER_APP_KEY',
    appSecret: 'YOUR_TWITTER_APP_SECRET',
    accessToken: 'YOUR_TWITTER_ACCESS_TOKEN',
    accessSecret: 'YOUR_TWITTER_ACCESS_SECRET',
});

const openai = new OpenAIApi(new Configuration({
    apiKey: 'YOUR_OPENAI_API_KEY',
}));

const bot = new TelegramBot(telegramToken, { polling: true });

const generateMessage = async () => {
    const prompt = `Generate a unique and engaging message about a cryptocurrency project inspired by the High Park TV series and its themes of AI.`;
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        });
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating message:', error);
        return 'Error generating message.';
    }
};

const generateImage = async (text) => {
    const prompt = `Create an artistic image that represents a cryptocurrency project inspired by the High Park TV series and its themes of AI.`;
    try {
        const response = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: '512x512', // Adjust the size as needed
        });
        return response.data.data[0].url; // Return the URL of the generated image
    } catch (error) {
        console.error('Error generating image:', error);
        return null;
    }
};

const sendMessage = async () => {
    const message = await generateMessage();
    const imageUrl = await generateImage(message);

    try {
        // Send message to Telegram
        await bot.sendMessage(telegramChatId, message);
        
        // If an image was generated, send it to Telegram
        if (imageUrl) {
            await bot.sendPhoto(telegramChatId, imageUrl, { caption: message });
        }

        // Post to Twitter
        await twitterClient.v1.tweet(message);
        if (imageUrl) {
            await twitterClient.v1.tweet('', { media_ids: [await twitterClient.v1.uploadMedia(imageUrl)] });
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

// Send a message every hour
setInterval(sendMessage, 60 * 60 * 1000); // 1 hour in milliseconds

console.log('Bot is running...');
