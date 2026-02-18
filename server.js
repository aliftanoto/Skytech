import 'dotenv/config'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { OpenRouter } from '@openrouter/sdk'
import { buildContext } from './src/utils/contextBuilder.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 3001

const BASE_SYSTEM_PROMPT = `You are a helpful AI assistant for Skytech Indonesia's website. Answer questions about the company and this website accurately and concisely. Use the following context:

{CONTEXT}

Answer in the same language the user uses (Indonesian or English). Be friendly and professional.`

const app = express()
app.use(express.json({ limit: '1mb' }))

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'OpenRouter API key not configured. Set OPENROUTER_API_KEY.' })
    return
  }
  
  const { messages = [] } = req.body
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array required' })
    return
  }

  // Get the last user message to build context
  const lastUserMessage = messages
    .filter(m => m.role === 'user')
    .pop()?.content || ''
  
  // Build dynamic context based on user message
  let dynamicContext = ''
  try {
    dynamicContext = buildContext(lastUserMessage)
  } catch (err) {
    console.error('Error building context:', err)
    // Fallback to basic context if context builder fails
    dynamicContext = 'Skytech Indonesia is a full-service advertising company founded in 2019.'
  }

  // Build system prompt with dynamic context
  const systemPrompt = BASE_SYSTEM_PROMPT.replace('{CONTEXT}', dynamicContext)

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  try {
    const openrouter = new OpenRouter({ apiKey })
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]
    
    const stream = await openrouter.chat.send({
      chatGenerationParams: {
        model: 'openrouter/aurora-alpha',
        messages: fullMessages,
        stream: true
      }
    })

    let fullResponse = ''
    for await (const chunk of stream) {
      const content = chunk?.choices?.[0]?.delta?.content
      if (content) {
        fullResponse += content
        res.write(`data: ${JSON.stringify({ content })}\n\n`)
        if (typeof res.flush === 'function') res.flush()
      }
    }
    res.write(`data: ${JSON.stringify({ done: true, fullResponse })}\n\n`)
  } catch (err) {
    console.error('OpenRouter error:', err)
    res.write(`data: ${JSON.stringify({ error: err.message || 'Chat failed' })}\n\n`)
  }
  res.end()
})

// Serve static files in production
if (isProd) {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
} else {
  // Use Vite middleware in development
  const vite = await createViteServer({ server: { middlewareMode: true } })
  app.use(vite.middlewares)
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  if (!isProd) console.log('(Vite dev mode)')
})
