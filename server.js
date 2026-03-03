import 'dotenv/config'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { OpenRouter } from '@openrouter/sdk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProd = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 3001

const SYSTEM_PROMPT = `You are the AI assistant for Skytech Indonesia's website. Answer only from the context below. Use the same language as the user (Indonesian or English). Be friendly and professional.

---

**Tentang Skytech Indonesia**
- Perusahaan full-service advertising didirikan 2019; juga menyediakan IT Outsourcing.
- Fokus: brand awareness dan performa iklan melalui strategi media berbasis data.
- Klien: agensi internasional & lokal, merek besar, pemerintah & institusi.
- Akses 100+ inventori digital & offline di Indonesia.
- Tagline: "Mentransformasi Strategi Pemasaran untuk Hasil yang Lebih Optimal."
- Kontak: Arun Suwardana (Founder), arun@skytechid.com, +62 858 8314 4435. Jakarta.

---

**IT Outsourcing (layanan outsourcing SDM IT — BUKAN pemasaran digital)**
Ini layanan outsourcing tenaga IT untuk operasional dan project development.
- Layanan: Application Support (L1 & L2), .NET Developer (Junior & Senior), Helpdesk & Technical Support, Project-Based IT Resource.
- Keunggulan: penempatan onsite/hybrid; kontrak jangka pendek & panjang; seleksi terstruktur; replacement policy; biaya transparan (monthly all-in).
- Tujuan: memastikan sistem berjalan stabil dan mendukung pengembangan teknologi berkelanjutan.
- Penutup: Dengan kombinasi ini, Skytech mampu memberikan solusi IT outsourcing yang efektif dan optimal untuk kebutuhan pemasaran digital Anda.

Jika ditanya "layanan IT outsourcing" atau "keunggulan IT outsourcing", jawab HANYA dari blok ini.

---

**Layanan Skytech (pemasaran digital & periklanan)**
Ini layanan utama periklanan dan pemasaran digital. Jangan campur dengan IT Outsourcing.
- Programmatic Advertising: Display, Outstream Video, Rich Media; DV360, GAM, SSP; Google Ads, Meta Ads, YouTube Ads, TikTok Ads.
- Performance Marketing: CPI, CPC, CPA, CPL, CPR; lead gen, installs, conversions.
- Media & Advertising: Media Planning & Buying; Event & Brand Activation; DOOH; Transit Advertising; OTT; Social Media Services.
- Direct Marketing: Push Notification; SMS/MMS Marketing; Call Center Marketing.
- Production: Video Production.
- Call Center Solutions: Standard System (setup 3–5 hari), Customized System (setup ~3 minggu).

Layanan-layanan ini dirancang untuk membantu klien meningkatkan brand awareness dan ad performance melalui strategi media yang data-driven.

Jika ditanya "layanan Skytech" atau "layanan apa saja", jawab dari blok ini (boleh singkat atau rinci sesuai pertanyaan).

---

**Klien & studi kasus**
- 25+ merek: McDonald's, Indosat, Samsung, Canva, Gudang Garam, Warner Bros, dll.
- Studi kasus: McDonald's CPR, IM3 Ooredoo, Surya Pro Mild, Gudang Garam Meta Ads, Canva Rich Media, Maricafe OTT, Baygon x Alfamart, Superman Launch Thamrin Nine, Weapons Movie activation.`

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
