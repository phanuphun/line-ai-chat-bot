
import 'dotenv/config';
import axios from 'axios';

const lineHttpClient = axios.create({
    baseURL: 'https://api.line.me',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_CH_ACCESS_KEY}`
    }
});

async function sendReplyMessage(replyToken: string, messages: any[]) {
    const url = 'https://api.line.me/v2/bot/message/reply';
    const body = {
        replyToken,
        messages
    };
    try {
        const response = await lineHttpClient.post(url, body);
        return response.data;
    } catch (error) {
        console.error('Error sending reply message:', error);
        throw error;
    }
};

async function sendPushMessage(to: string, messages: any[]) {
    const url = 'https://api.line.me/v2/bot/message/push';
    const body = {
        to,
        messages
    };
    try {
        const response = await lineHttpClient.post(url, body);
        return response.data;
    } catch (error) {
        console.error('Error sending push message:', error);
        throw error;
    }
};
    
export { sendReplyMessage, sendPushMessage };