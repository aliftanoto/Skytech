import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Resolve path relative to project root (server.js location)
const COMPANY_DATA_PATH = path.resolve(__dirname, '../../data/companyData.json')

let companyData = null

function loadCompanyData() {
  if (!companyData) {
    try {
      const data = fs.readFileSync(COMPANY_DATA_PATH, 'utf-8')
      companyData = JSON.parse(data)
    } catch (err) {
      console.error('Error loading company data:', err)
      throw new Error('Failed to load company data')
    }
  }
  return companyData
}

function normalizeText(text) {
  return text.toLowerCase().trim()
}

function hasKeyword(message, keywords) {
  const normalized = normalizeText(message)
  return keywords.some(keyword => normalized.includes(normalizeText(keyword)))
}

export function buildContext(userMessage) {
  const data = loadCompanyData()
  const message = normalizeText(userMessage)
  const context = []

  // Always include basic about info
  context.push(`**About Skytech Indonesia:**
- Full-service advertising company founded in ${data.about.founded}.
- ${data.about.description}
- Serves: ${data.about.clients.join(', ')}.
- Access to ${data.about.inventory}.`)

  // Services detection
  const serviceKeywords = [
    'service', 'layanan', 'jasa', 'apa yang', 'what', 'programmatic', 'performance',
    'marketing', 'pemasaran', 'advertising', 'iklan', 'social media', 'call center',
    'event', 'DOOH', 'OTT', 'transit', 'video', 'production', 'SMS', 'push notification'
  ]
  if (hasKeyword(message, serviceKeywords)) {
    context.push(`\n**Services:**
${data.services.map(s => `- ${s.name}: ${s.details}`).join('\n')}`)
  }

  // Call Center detection
  const callCenterKeywords = [
    'call center', 'callcenter', 'telepon', 'phone', 'customer service', 'layanan pelanggan',
    'standard system', 'customized system', 'instalasi', 'setup'
  ]
  if (hasKeyword(message, callCenterKeywords)) {
    context.push(`\n**Call Center Solutions:**
- Features: ${data.callCenter.features.join(', ')}
- Option 1: ${data.callCenter.options.standard.name} - ${data.callCenter.options.standard.description} (${data.callCenter.options.standard.setupTime})
- Option 2: ${data.callCenter.options.customized.name} - ${data.callCenter.options.customized.description} (${data.callCenter.options.customized.setupTime})
- Impact: ${data.callCenter.impact}`)
  }

  // Case Studies detection
  const caseStudyKeywords = [
    'case study', 'studi kasus', 'success', 'hasil', 'result', 'campaign', 'kampanye',
    'mcdonald', 'im3', 'ooredoo', 'surya', 'gudang garam', 'canva', 'maricafe',
    'baygon', 'superman', 'weapons', 'example', 'contoh'
  ]
  if (hasKeyword(message, caseStudyKeywords)) {
    const caseStudies = data.caseStudies.slice(0, 5).map(cs => {
      const stats = cs.stats ? Object.entries(cs.stats).map(([k, v]) => `${k}: ${v}`).join(', ') : ''
      return `- ${cs.title}: ${cs.subtitle}${stats ? ` (${stats})` : ''}`
    }).join('\n')
    context.push(`\n**Case Studies:**
${caseStudies}`)
  }

  // Clients detection
  const clientKeywords = [
    'client', 'klien', 'brand', 'merek', 'partner', 'mitra', 'trusted', 'dipercaya',
    'who', 'siapa', 'company', 'perusahaan'
  ]
  if (hasKeyword(message, clientKeywords)) {
    context.push(`\n**Trusted Clients:**
Trusted by 25+ brands including: ${data.clients.slice(0, 10).join(', ')}, and more.`)
  }

  // Metrics detection
  const metricsKeywords = [
    'metric', 'metrik', 'CPM', 'CTR', 'CPI', 'CPC', 'CPA', 'CPL', 'CPR', 'VTR',
    'performance', 'kinerja', 'abbreviation', 'singkatan', 'meaning', 'arti'
  ]
  if (hasKeyword(message, metricsKeywords)) {
    const metrics = Object.entries(data.metrics).map(([k, v]) => `- ${k}: ${v}`).join('\n')
    context.push(`\n**Performance Metrics:**
${metrics}`)
  }

  // Contact detection
  const contactKeywords = [
    'contact', 'kontak', 'email', 'phone', 'telepon', 'alamat', 'address', 'lokasi',
    'location', 'hubungi', 'reach', 'get in touch', 'arun', 'founder'
  ]
  if (hasKeyword(message, contactKeywords)) {
    context.push(`\n**Contact Information:**
- ${data.contact.founder.name} (${data.contact.founder.role})
- Email: ${data.contact.founder.email}
- Phone: ${data.contact.founder.phone}
- Location: ${data.contact.location.address}`)
  }

  // Why Us detection
  const whyUsKeywords = [
    'why', 'mengapa', 'choose', 'pilih', 'benefit', 'keuntungan', 'advantage', 'kelebihan',
    'different', 'beda', 'unique', 'unik'
  ]
  if (hasKeyword(message, whyUsKeywords)) {
    const whyUs = data.whyUs.map(w => `- ${w.title}: ${w.description}`).join('\n')
    context.push(`\n**Why Choose Skytech Indonesia:**
${whyUs}`)
  }

  return context.join('\n')
}
