import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { sendReplyMessage, sendPushMessage } from './services/line.js'
import { chat } from './services/openWebUi.js'

const app = new Hono()
const api = new Hono()

app.use(logger())
app.use(cors())

app.get('/', (c) => {
  return c.json({
    service: 'LINE AI Chat Bot',
    status: 'Running',
    version: '1.0.0',
    message: 'Welcome to the LINE AI Chat Bot service!'
  })
})

api.post('/line/webhook', async (c) => {
  const { events } = await c.req.json()
  c.status(200)
  if (!events || events.length === 0) {
    return c.json({ status: 'no events' })
  }
  const replyToken = events[0].replyToken
  const userMessage = events[0].message.text
  const userId = events[0].source.userId
  try {
    sendReplyMessage(replyToken, [
      { type: 'text', text: 'Message received. Alpha Gemma 3 is processing, please wait...' }
    ])
    chat({ model: 'gemma3:1b', messages: [{ role: 'user', content: userMessage }] }).then((response) => {
      const aiMessage = response.choices[0].message.content
      sendPushMessage(userId, [
        { type: 'text', text: aiMessage }
      ])
    })
    return c.json({ status: 'success' })
  } catch (error) {
    console.error('Error processing webhook:', error);
  }

})

app.route('/api/v1', api)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
