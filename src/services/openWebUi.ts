import axios from 'axios';
import 'dotenv/config';

const openWebUiHttpClient = axios.create({
  baseURL: process.env.OPEN_WEB_UI_URL_BASE || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPEN_WEB_UI_API_KEY}`
    }
});

async function chat(data: any) {
  try {
    const response = await openWebUiHttpClient.post('/api/chat/completions', data);
    return response.data;
  } catch (error) {
    console.error('Error opening web UI:', error);
    throw error;
  }
};

export { chat };