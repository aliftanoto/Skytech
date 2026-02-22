import 'dotenv/config'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { OpenRouter } from '@openrouter/sdk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 3001

const SYSTEM_PROMPT = `You are a helpful AI assistant for Skytech Indonesia's website. Answer questions about the company and this website accurately and concisely. Use the following context:

**About Skytech Indonesia:**
- Full-service advertising company founded in 2019.
- Helps clients with brand awareness and ad performance through data-driven media strategy.
- Serves: international and local agencies, major brands, government and institutional clients.
- Access to 100+ digital and offline inventory across Indonesia.
- Services: Programmatic Advertising (DV360, GAM, SSP, Display, Outstream Video, Rich Media, Google/Meta/YouTube/TikTok Ads), Performance Marketing (CPI, CPC, CPA, CPL, CPR, lead gen, installs, conversions), Event & Brand Activation, DOOH, Transit Advertising, OTT Advertising, Social Media Services, Media Planning & Buying, Push Notification, SMS/MMS Marketing, Call Center Marketing, Video Production.
- Call Center solutions: Standard System (3–5 days setup), Customized System (~3 weeks).
- Trusted by 25+ brands (e.g. McDonald's, Indosat, Samsung, Canva, Gudang Garam, Warner Bros).
- Case studies include: McDonald's CPR, IM3 Ooredoo, Surya Pro Mild, Gudang Garam Meta Ads, Canva Rich Media, Maricafe OTT, Baygon x Alfamart, Superman Launch Thamrin Nine, Weapons Movie activation.
- Contact: Arun Suwardana (Founder), arun@skytechid.com, +62 858 8314 4435. Jakarta, Indonesia.
- Tagline: "Mentransformasi Strategi Pemasaran untuk Hasil yang Lebih Optimal."

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
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  try {
    const openrouter = new OpenRouter({ apiKey })
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ]
    const stream = await openrouter.chat.send({
      chatGenerationParams: {
        model: 'arcee-ai/trinity-large-preview:free',
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
      if (chunk?.usage?.reasoningTokens != null) {
        res.write(`data: ${JSON.stringify({ reasoningTokens: chunk.usage.reasoningTokens })}\n\n`)
      }
    }
    res.write(`data: ${JSON.stringify({ done: true, fullResponse })}\n\n`)
  } catch (err) {
    console.error('OpenRouter error:', err)
    res.write(`data: ${JSON.stringify({ error: err.message || 'Chat failed' })}\n\n`)
  }
  res.end()
})

if (isProd) {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
} else {
  const vite = await createViteServer({ server: { middlewareMode: true } })
  app.use(vite.middlewares)
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  if (!isProd) console.log('(Vite dev mode)')
})
