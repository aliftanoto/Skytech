import { useState, useEffect } from 'react'
import logoImage from './assets/LOGO_SKYTECH.png'

const WHATSAPP_NUMBER = '6285219588144'

// Load all logo assets from LOGO folder for "Dipercaya oleh Brand Terkemuka"
const logoPng = import.meta.glob('./assets/LOGO/*.png', { eager: true, query: '?url',import: 'default' })
const logoSvg = import.meta.glob('./assets/LOGO/*.svg', { eager: true, query: '?url',import: 'default' })
const logoFiles = { ...logoPng, ...logoSvg }

const LOGO_DISPLAY_NAMES = {
  'indosat': 'Indosat',
  'samsung': 'Samsung',
  'nissan': 'Nissan',
  'singapore-airlines': 'Singapore Airlines',
  'sc-johnson': 'SC Johnson',
  'canva': 'Canva',
  'hp': 'HP',
  'allianz': 'Allianz',
  'mcdonalds': "McDonald's",
  'niaga': 'CIMB Niaga',
  'cimb-niaga': 'CIMB Niaga',
  'telkomsel': 'Telkomsel',
  'nivea': 'Nivea',
  'zurich': 'Zurich',
  'electrolux': 'Electrolux',
  'lg': 'LG',
  'coca-cola': 'Coca-Cola',
  'mg': 'MG',
  'ikea': 'IKEA',
  'warner-bros': 'Warner Bros',
  'sprite': 'Sprite',
  'hsbc': 'HSBC',
  'gudang-garam': 'Gudang Garam',
  'Gudang-Garam': 'Gudang Garam',
  'guardian': 'Guardian',
  'enervon': 'Enervon',
  'kiwi': 'Kiwi',
}

const CLIENT_LOGOS = Object.entries(logoFiles).map(([path, url]) => {
  const filename = path.replace(/^.*\/([^/]+)$/, '$1').replace(/\.[^.]+$/, '')
  const name = LOGO_DISPLAY_NAMES[filename] || LOGO_DISPLAY_NAMES[filename.toLowerCase()] || filename.replace(/-/g, ' ')
  return { name, logo: url }
}).sort((a, b) => a.name.localeCompare(b.name))

// Simple markdown renderer for bold text (**text**)
function renderMarkdown(text) {
  if (!text) return ''
  // Split by **text** patterns, handling multiple occurrences
  // Use non-greedy match to handle multiple bold sections: \*\*[^*]+\*\*
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  const result = []
  
  parts.forEach((part, i) => {
    if (!part) return
    
    // Check if this part is a bold marker
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      result.push(<strong key={`bold-${i}`}>{part.slice(2, -2)}</strong>)
    } else {
      // Regular text - preserve newlines
      const lines = part.split('\n')
      lines.forEach((line, lineIdx) => {
        if (lineIdx > 0) {
          result.push(<br key={`br-${i}-${lineIdx}`} />)
        }
        if (line) {
          result.push(<span key={`text-${i}-${lineIdx}`}>{line}</span>)
        }
      })
    }
  })
  
  return result.length > 0 ? <>{result}</> : text
}

function HeroLogo() {
  return (
    <img src={logoImage} alt="Skytech Indonesia" className="h-32 sm:h-24 md:h-28 mb-12 drop-shadow-[0_10px_30px_rgba(0,117,212,0.4)] hero-fade-down w-auto object-contain" />
  )
}

function FooterLogo() {
  return (
    <img src={logoImage} alt="Skytech Indonesia" className="h-32 sm:h-32 mx-auto my-8 opacity-80 w-auto object-contain" />
  )
}

const SERVICES = [
  { icon: '📊', title: 'Programmatic Advertising', desc: 'DV360, GAM, SSP IO-based, Display Banner, Outstream Video & Rich Media Banner' },
  { icon: '🎯', title: 'Performance Marketing', desc: 'CPI, CPC, CPA, CPL, CPR - Lead gen, installs, conversions dengan hasil terukur' },
  { icon: '🎪', title: 'Event & Brand Activation', desc: 'Launches, roadshows, EO dengan creative + field team profesional' },
  { icon: '📺', title: 'DOOH Advertising', desc: 'Mall screens, office towers, elevator LEDs di lokasi strategis' },
  { icon: '🚌', title: 'Transit Advertising', desc: 'Truck branding, TransJakarta bus wraps untuk jangkauan maksimal' },
  { icon: '📱', title: 'OTT Advertising', desc: 'Pre-roll/mid-roll on Vidio, WeTV, Vision+, dan platform OTT lainnya' },
  { icon: '💬', title: 'Social Media Services', desc: 'Organic + Paid (TikTok, IG, FB, LinkedIn) untuk engagement optimal' },
  { icon: '📈', title: 'Media Planning & Buying', desc: 'Channel strategy & ROI simulation berbasis data' },
  { icon: '🔔', title: 'Push Notification', desc: 'CRM retargeting via web & mobile push' },
  { icon: '📧', title: 'SMS & MMS Marketing', desc: 'Nationwide segmented blasts' },
  { icon: '📞', title: 'Call Center Marketing', desc: 'Cloud & On Premise Call Center System dengan managed services' },
  { icon: '🎬', title: 'Video Production', desc: 'Konten video berkualitas tinggi untuk semua platform' },
]

const CASE_STUDIES = [
  { title: "McDonald's - CPR", subtitle: "McDonald's App Install Campaign, Focusing on Registrations – 91% Registration Rate", stats: [
    { label: 'Installs', value: '2,739,205' },
    { label: 'Registrations', value: '2,492,766' },
    { label: 'CTR', value: '1.03%' },
  ]},
  { title: 'IM3 Ooredoo - CPM', subtitle: 'Indosat Ooredoo Awareness Campaign during Covid Era, targeting all cities in Indonesia', stats: [
    { label: 'Impressions', value: '1.63B' },
    { label: 'Clicks', value: '16.9M' },
    { label: 'CTR', value: '0.27%' },
  ]},
  { title: 'Surya Pro Mild - CPC', subtitle: 'Pro Mild AR Anya Batch 6, Clicks Campaign. Audience: Male 18-24. Medan & Surabaya', stats: [
    { label: 'Clicks', value: '179,996' },
    { label: 'Impressions', value: '34.3M' },
    { label: 'CTR', value: '0.53%' },
  ]},
  { title: 'Gudang Garam - Meta Ads', subtitle: 'Kampanye Awareness untuk Gudang Garam Signature', stats: [
    { label: 'Impressions', value: '275.7M' },
    { label: 'Clicks', value: '337,015' },
    { label: 'Reach', value: '34.8M' },
  ]},
  { title: 'Canva - Rich Media', subtitle: 'Kampanye Awareness Rich Media Banner', stats: [
    { label: 'Impressions', value: '10M' },
    { label: 'Clicks', value: '50,000' },
    { label: 'CTR', value: '1.1%' },
  ]},
  { title: 'Maricafe - OTT & PR', subtitle: 'Kampanye OTT & Siaran Pers untuk Maricafe', stats: [
    { label: 'Impressions', value: '19.1M' },
    { label: 'Clicks', value: '181,389' },
    { label: 'Completion Rate', value: '87.48%' },
  ]},
]

const CALL_CENTER_FEATURES = [
  'Integrasi yang Mulus',
  'Fitur Canggih untuk Meningkatkan Efisiensi',
  'Skalabilitas untuk Memenuhi Kebutuhan Anda',
  'Pengalaman Pelanggan yang Dipersonalisasi',
  'Komunikasi Multichannel',
  'Analitik Real-Time untuk Pengambilan Keputusan yang Tepat',
  'Peningkatan Standar Keamanan',
  'Aksesibilitas Mobile untuk Fleksibilitas',
  'Dukungan dan Pelatihan 24/7',
  'Harga yang Kompetitif',
]

export default function App() {
  const [showWaModal, setShowWaModal] = useState(false)
  const [waPopup, setWaPopup] = useState({ name: '', email: '', message: '' })
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [navOpen, setNavOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  function openWaModal() {
    setWaPopup({ name: '', email: '', message: '' })
    setShowWaModal(true)
  }

  function closeWaModal() {
    setShowWaModal(false)
  }

  function sendWhatsAppFromPopup(e) {
    e.preventDefault()
    const { name, message } = waPopup
    if (!name.trim() || !message.trim()) return
    let msg = `Halo, nama saya ${name.trim()}.`
    if (waPopup.email.trim()) msg += `\nEmail: ${waPopup.email.trim()}`
    msg += `\n\n${message.trim()}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
    closeWaModal()
  }

  async function sendChatMessage(e) {
    e.preventDefault()
    const text = chatInput.trim()
    if (!text || chatLoading) return
    const userMsg = { role: 'user', content: text }
    setChatMessages((prev) => [...prev, userMsg])
    setChatInput('')
    setChatLoading(true)
    setStreamingContent('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({ role: m.role, content: m.content }))
        })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullResponse = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const json = line.slice(6)
          if (json === '[DONE]') continue
          try {
            const data = JSON.parse(json)
            if (data.error) throw new Error(data.error)
            if (data.content) {
              fullResponse += data.content
              setStreamingContent(fullResponse)
            }
            if (data.fullResponse) fullResponse = data.fullResponse
          } catch (_) {}
        }
      }
      setChatMessages((prev) => [...prev, { role: 'assistant', content: fullResponse || '(No response)' }])
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message}` }])
    } finally {
      setStreamingContent('')
      setChatLoading(false)
    }
  }

  useEffect(() => {
    if (showWaModal) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [showWaModal])

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') closeWaModal() }
    if (showWaModal) {
      window.addEventListener('keydown', onKeyDown)
      return () => window.removeEventListener('keydown', onKeyDown)
    }
  }, [showWaModal])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )
    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href').slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return
    const close = (e) => {
      if (e.target.closest('[data-nav-dropdown]') === null) setDropdownOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [dropdownOpen])

  const navDropdownItems = [
    { id: 'services', label: 'Layanan' },
    { id: 'call-center', label: 'Call Center' },
    { id: 'case-studies', label: 'Studi Kasus' },
    { id: 'clients', label: 'Klien' },
  ]

  function scrollToSection(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen">
      {/* Top navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#002447]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex items-center shrink-0">
              <img src={logoImage} alt="Skytech Indonesia" className="h-24 sm:h-24 w-auto object-contain" />
            </a>
            <div className="hidden md:flex items-center gap-1">
              <button type="button" onClick={() => scrollToSection('about')} className="px-3 py-2 text-sm text-white/90 hover:text-[#00bcd4] hover:bg-white/5 rounded-lg transition-colors">
                Tentang
              </button>
              <div className="relative" data-nav-dropdown>
                <button type="button" onClick={() => setDropdownOpen((o) => !o)} className="px-3 py-2 text-sm font-medium text-white hover:text-[#00bcd4] hover:bg-white/10 rounded-lg transition-colors inline-flex items-center gap-2 border border-white/20 hover:border-white/40" aria-expanded={dropdownOpen} aria-haspopup="true">
                  <span>Layanan</span>
                  <svg className={`w-4 h-4 shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 py-2 w-48 bg-[#002447] border border-white/10 rounded-lg shadow-xl z-50">
                    {navDropdownItems.map((link) => (
                      <button key={link.id} type="button" onClick={() => { scrollToSection(link.id); setDropdownOpen(false) }} className="block w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-[#00bcd4]">
                        {link.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" onClick={() => scrollToSection('why-us')} className="px-3 py-2 text-sm text-white/90 hover:text-[#00bcd4] hover:bg-white/5 rounded-lg transition-colors">
                Mengapa Kami
              </button>
              <button type="button" onClick={() => scrollToSection('contact')} className="px-3 py-2 text-sm text-white/90 hover:text-[#00bcd4] hover:bg-white/5 rounded-lg transition-colors">
                Kontak
              </button>
            </div>
            <div className="md:hidden relative">
              <button type="button" onClick={() => setNavOpen((o) => !o)} className="p-2 text-white rounded-lg hover:bg-white/10" aria-label="Menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{navOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}</svg>
              </button>
              {navOpen && (
                <div className="absolute right-0 top-full mt-1 py-2 w-48 bg-[#002447] border border-white/10 rounded-lg shadow-xl">
                  <button type="button" onClick={() => { scrollToSection('about'); setNavOpen(false) }} className="block w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-[#00bcd4]">Tentang</button>
                  <div className="border-t border-white/10 my-1" />
                  <div className="px-4 py-1 text-xs text-white/60 uppercase tracking-wider">Layanan</div>
                  {navDropdownItems.map((link) => (
                    <button key={link.id} type="button" onClick={() => { scrollToSection(link.id); setNavOpen(false) }} className="block w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-[#00bcd4] pl-6">
                      {link.label}
                    </button>
                  ))}
                  <div className="border-t border-white/10 my-1" />
                  <button type="button" onClick={() => { scrollToSection('why-us'); setNavOpen(false) }} className="block w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-[#00bcd4]">Mengapa Kami</button>
                  <button type="button" onClick={() => { scrollToSection('contact'); setNavOpen(false) }} className="block w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-[#00bcd4]">Kontak</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#002447] via-[#003d6b] to-[#0075d4]">
        <div className="absolute inset-0 w-[150%] h-[150%] hero-morph bg-[radial-gradient(circle_at_20%_50%,rgba(0,136,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_50%,rgba(0,212,255,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 hero-dots-pulse bg-[length:30px_30px] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
        <div className="relative z-10 text-center px-8 max-w-[1200px]">
          <HeroLogo />
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 hero-fade-up text-[length:clamp(2.5rem,8vw,5rem)]" style={{ animationDelay: '0.2s' }}>
            Mentransformasi Strategi Pemasaran untuk Hasil yang Lebih Optimal
          </h1>
          <p className="text-[#00bcd4] text-lg sm:text-xl mb-12 font-light hero-fade-up max-w-2xl mx-auto" style={{ animationDelay: '0.4s' }}>
            Temukan bagaimana kami menciptakan iklan yang lebih cerdas yang menghasilkan hasil yang lebih baik bagi klien kami
          </p>
          <a href="#contact" className="hero-fade-up inline-block py-5 px-12 bg-[#ff6b35] text-white font-bold text-lg rounded-[50px] shadow-[0_10px_30px_rgba(255,107,53,0.4)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(255,107,53,0.6)] transition-all duration-300 relative overflow-hidden" style={{ animationDelay: '0.6s' }}>
            Hubungi Kami
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="about fade-in py-16 sm:py-24 bg-gradient-to-b from-[#f0f4f8] to-[#e3eef7] relative">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <h2 className="section-title text-[#003d6b] text-3xl sm:text-4xl font-extrabold mb-4">Tentang Skytech Indonesia</h2>
          <p className="text-[#555] text-lg sm:text-xl mt-8 max-w-[900px]">
            Skytech Indonesia adalah perusahaan periklanan layanan penuh yang didirikan pada tahun 2019, yang dibangun untuk membantu klien mengatasi permasalahan awareness dan performa iklan melalui strategi media yang berbasis data.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              { title: '100+ Inventori Digital & Offline', body: 'Dengan akses ke lebih dari 100 inventori digital dan offline di seluruh Indonesia, kami menawarkan rangkaian solusi yang lengkap.' },
              { title: 'Klien Kami', body: 'Kami melayani agensi internasional dan lokal, merek-merek besar dari berbagai industri, serta klien pemerintah dan institusional.' },
              { title: 'Solusi Komprehensif', body: 'Programmatic, performance, OOH, aktivasi event, dan kampanye media sosial - semuanya dalam satu tempat.' },
            ].map((card) => (
              <div key={card.title} className="bg-white p-8 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,117,212,0.25)] transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[5px] rounded-t-[20px] bg-gradient-to-r from-[#0075d4] to-[#00bcd4]" />
                <h3 className="text-[#003d6b] text-xl font-bold mb-4">{card.title}</h3>
                <p className="text-[#555] leading-relaxed text-[1.05rem]">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="services fade-in py-16 sm:py-24 bg-gradient-to-br from-[#002447] to-[#003d6b] text-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10">
          <h2 className="section-title text-white text-3xl sm:text-4xl font-extrabold mb-4">Solusi Digital Marketing Kami</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/10 text-center hover:bg-white/10 hover:border-[#00bcd4] hover:scale-105 transition-all duration-300">
                <span className="text-4xl block mb-4">{s.icon}</span>
                <h3 className="text-[#00bcd4] text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          
          {/* Metrik Kinerja */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <h3 className="text-white text-xl font-semibold mb-4 text-center">Metrik Kinerja</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
              <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                <div className="text-[#00bcd4] font-bold text-sm mb-1">CPM</div>
                <div className="text-white/70 text-xs">Efisiensi Biaya</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                <div className="text-[#00bcd4] font-bold text-sm mb-1">CTR</div>
                <div className="text-white/70 text-xs">Tingkat Keterlibatan</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                <div className="text-[#00bcd4] font-bold text-sm mb-1">CPI</div>
                <div className="text-white/70 text-xs">Fokus Instalasi Aplikasi</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                <div className="text-[#00bcd4] font-bold text-sm mb-1">CPC</div>
                <div className="text-white/70 text-xs">Efektivitas Biaya per Klik</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                <div className="text-[#00bcd4] font-bold text-sm mb-1">CPA/CPL/CPR</div>
                <div className="text-white/70 text-xs">Metrik berbasis hasil</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                <div className="text-[#00bcd4] font-bold text-sm mb-1">VTR</div>
                <div className="text-white/70 text-xs">Tingkat Penayangan Video</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call Center */}
      <section id="call-center" className="call-center fade-in py-16 sm:py-24 bg-gradient-to-br from-[#002447] to-[#003d6b] text-white">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <h2 className="section-title text-white text-3xl sm:text-4xl font-extrabold mb-4">Solusi Call Center untuk Bisnis Anda</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 items-center">
            <div>
              <h3 className="text-[#00bcd4] text-2xl font-bold mb-8">Fitur Unggulan</h3>
              <ul className="space-y-0">
                {CALL_CENTER_FEATURES.map((f) => (
                  <li key={f} className="py-4 pl-10 relative text-[1.1rem] leading-relaxed before:content-['✓'] before:absolute before:left-0 before:text-[#ff6b35] before:text-2xl before:font-bold">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-[20px] border-2 border-white/10">
                <div className="bg-[#0075d4]/20 p-6 rounded-2xl mb-4 border-l-4 border-l-[#00bcd4]">
                  <h4 className="text-[#00bcd4] text-xl font-bold mb-2">Opsi 1: Standard System</h4>
                  <p className="text-white/80 leading-relaxed">Siap digunakan dengan proses instalasi cepat dalam 3–5 hari</p>
                </div>
                <div className="bg-[#0075d4]/20 p-6 rounded-2xl mb-4 border-l-4 border-l-[#00bcd4]">
                  <h4 className="text-[#00bcd4] text-xl font-bold mb-2">Opsi 2: Customized System</h4>
                  <p className="text-white/80 leading-relaxed">Biasanya membutuhkan waktu sekitar 3 minggu untuk proses instalasi</p>
                </div>
                <div className="bg-[#ffc107]/10 p-6 rounded-2xl border-2 border-[#ffc107]">
                  <h4 className="text-[#ffc107] text-lg font-bold mb-4">Dampak Nyata</h4>
                  <p className="text-white leading-relaxed">Penjualan bulanan meningkat 75% (dari IDR 500 juta menjadi IDR 850 juta). Leads baru meningkat 80%, kepuasan pelanggan naik 15%, dan waktu penanganan panggilan turun 37%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="case-studies fade-in py-16 sm:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <h2 className="section-title text-[#003d6b] text-3xl sm:text-4xl font-extrabold mb-4">Studi Kasus Sukses Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
            {CASE_STUDIES.map((c) => (
              <div key={c.title} className="bg-[#f0f4f8] rounded-[20px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-400">
                <div className="p-8 bg-gradient-to-br from-[#003d6b] to-[#0075d4] text-white">
                  <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                  <p className="text-white/90 text-sm sm:text-base">{c.subtitle}</p>
                </div>
                <div className="p-8">
                  {c.stats.map((stat, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-black/10 last:border-0">
                      <span className="font-semibold text-[#003d6b] text-[1.05rem]">{stat.label}</span>
                      <span className="text-xl font-extrabold text-[#ff6b35]" style={{ fontFamily: "'Space Mono', monospace" }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section id="clients" className="clients fade-in py-16 sm:py-24 bg-gradient-to-br from-[#f8fafb] to-[#e8f1f7]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <h2 className="section-title text-[#003d6b] text-3xl sm:text-4xl font-extrabold text-center mb-4">Dipercaya oleh Brand Terkemuka</h2>
          <p className="text-center text-[#555] text-lg mb-12">Lebih dari 25 merek telah memilih Skytech Indonesia sebagai mitra pertumbuhan mereka</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center items-center">
            {CLIENT_LOGOS.map(({ name, logo }) => (
              <div key={name} className="flex items-center justify-center py-4 px-4 h-24 sm:h-28 opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300">
                <img src={logo} alt={name} className="max-h-16 sm:max-h-20 max-w-[140px] w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="why-us fade-in py-16 sm:py-24 bg-gradient-to-br from-[#002447] to-[#003d6b] text-white relative overflow-hidden">
        <div className="absolute inset-0 w-[200%] h-[200%] why-move-bg bg-[length:50px_50px] bg-[radial-gradient(circle,rgba(0,117,212,0.08)_1px,transparent_1px)]" />
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10">
          <h2 className="section-title text-white text-3xl sm:text-4xl font-extrabold mb-4">Mengapa Memilih Skytech Indonesia?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { title: 'Hasil Terbukti dengan Strategi Berbasis Data', body: 'Kami menghadirkan hasil yang terukur sebagai wujud komitmen kami terhadap kesuksesan dan pertumbuhan Anda. Setiap kampanye didukung oleh analitik dan insight yang kuat.' },
              { title: 'Komunikasi dan Dukungan yang Transparan', body: 'Tim kami menjaga komunikasi yang terbuka, memastikan Anda selalu mendapatkan informasi dan dukungan secara menyeluruh sepanjang proses.' },
              { title: 'Solusi yang Disesuaikan untuk Kebutuhan Bisnis yang Unik', body: 'Kami menyesuaikan layanan kami dengan tujuan spesifik Anda untuk memaksimalkan dampak setiap kampanye yang dijalankan.' },
            ].map((card) => (
              <div key={card.title} className="bg-white/5 backdrop-blur-sm p-8 rounded-[20px] border-l-4 border-l-[#ff6b35] hover:bg-white/10 hover:translate-x-2 transition-all duration-300">
                <h3 className="text-[#00bcd4] text-xl font-bold mb-4">{card.title}</h3>
                <p className="text-white/90 leading-relaxed text-[1.05rem]">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact fade-in py-16 sm:py-24 bg-gradient-to-br from-[#002247] to-[#003d6b] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[length:100px_100px] bg-[url('data:image/png+xml,%3Csvg xmlns=%22http://www.w3.org/2000/png%22 viewBox=%220 0 100 100%22%3E%3Cpath d=%22M0,0 L50,50 L0,100 Z%22 fill=%22rgba(255,255,255,0.05)%22/%3E%3C/png%3E')]" />
        <div className="max-w-[900px] mx-auto px-6 text-center relative z-10">
          <h2 className="section-title section-title-white text-white text-3xl sm:text-4xl font-extrabold mb-6">Mari Berkolaborasi</h2>
          <p className="text-xl mb-10">Siap untuk mentransformasi strategi pemasaran Anda? Hubungi kami.</p>
          <div className="space-y-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/20">
              <h3 className="text-xl font-bold mb-2">Arun Suwardana (Founder)</h3>
              <p><a href="mailto:arun@skytechid.com" className="text-white font-semibold text-lg hover:text-[#ffc107] transition-colors">arun@skytechid.com</a></p>
              <p><a href="tel:+6285883144435" className="text-white font-semibold text-lg hover:text-[#ffc107] transition-colors">+62 858 8314 4435</a></p>
              <button type="button" onClick={openWaModal} className="mt-6 inline-flex items-center gap-3 py-4 px-8 bg-[#25D366] text-white font-bold text-lg rounded-[50px] shadow-lg hover:scale-105 hover:shadow-xl transition-all">
                <span className="text-2xl">💬</span>
                <span>Chat via WhatsApp</span>
              </button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/20">
              <h3 className="text-xl font-bold mb-2">Lokasi Kantor</h3>
              <p className="text-white/95 text-left sm:text-center leading-relaxed">
                Wisma IWI, Jl. Arjuna Sel. No.75 2, RT.2/RW.12, Kb. Jeruk, Kec. Kb. Jeruk, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11530, Indonesia
              </p>
              <a href="https://www.google.com/maps/search/?api=1&query=Wisma+IWI,+Jl.+Arjuna+Sel.+No.75+2,+Kb.+Jeruk,+Jakarta+Barat+11530,+Indonesia" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[#00bcd4] hover:text-[#ffc107] font-semibold transition-colors">
                Buka di Google Maps →
              </a>
              <div className="mt-6 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl aspect-video w-full max-w-2xl mx-auto">
                <iframe
                  title="Lokasi Skytech Indonesia"
                  src="https://www.google.com/maps?q=Wisma+IWI,+Jl.+Arjuna+Sel.+No.75+2,+RT.2/RW.12,+Kb.+Jeruk,+Kec.+Kb.+Jeruk,+Kota+Jakarta+Barat,+Jakarta+11530,+Indonesia&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '280px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp popup modal */}
      {showWaModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeWaModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#003d6b]">Kirim pesan via WhatsApp</h3>
                <button type="button" onClick={closeWaModal} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Tutup">
                  <png className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></png>
                </button>
              </div>
              <form onSubmit={sendWhatsAppFromPopup} className="space-y-5">
                <div>
                  <label htmlFor="wa-name" className="block text-sm font-semibold text-gray-700 mb-1">Nama *</label>
                  <input type="text" id="wa-name" required placeholder="Nama Anda" value={waPopup.name} onChange={(e) => setWaPopup((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#25D366] transition-colors" />
                </div>
                <div>
                  <label htmlFor="wa-email" className="block text-sm font-semibold text-gray-700 mb-1">Email (opsional)</label>
                  <input type="email" id="wa-email" placeholder="email@contoh.com" value={waPopup.email} onChange={(e) => setWaPopup((p) => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#25D366] transition-colors" />
                </div>
                <div>
                  <label htmlFor="wa-message" className="block text-sm font-semibold text-gray-700 mb-1">Pesan *</label>
                  <textarea id="wa-message" required placeholder="Tulis pesan Anda..." rows={4} value={waPopup.message} onChange={(e) => setWaPopup((p) => ({ ...p, message: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#25D366] transition-colors resize-y min-h-[100px]" />
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-[#25D366] text-white font-bold text-lg rounded-xl hover:bg-[#20bd5a] transition-colors">
                  <span>💬</span>
                  <span>Kirim & Buka WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#002447] text-white/70 py-12 text-center px-6">
        <FooterLogo />
        <p className="text-base mb-2">&copy; 2026 Skytech Indonesia. All rights reserved.</p>
        <p>Mentransformasi Strategi Pemasaran untuk Hasil yang Lebih Optimal</p>
      </footer>

      {/* Floating AI Chatbot button */}
      <button type="button" onClick={() => setChatOpen((o) => !o)} className="fixed w-14 h-14 bottom-8 right-8 bg-[#003d6b] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all z-[1000] border-2 border-[#00bcd4]" aria-label="Open AI assistant">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      </button>

      {/* Chatbot panel */}
      {chatOpen && (
        <div className="fixed bottom-24 right-8 z-[1001] w-[380px] max-w-[calc(100vw-2rem)] max-h-[520px] flex flex-col rounded-2xl shadow-2xl bg-white border-2 border-[#003d6b]/20 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#003d6b] text-white">
            <span className="font-bold">Skytech AI Assistant</span>
            <button type="button" onClick={() => setChatOpen(false)} className="p-1 rounded hover:bg-white/20" aria-label="Close">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {chatMessages.length === 0 && !chatLoading && (
              <p className="text-gray-500 text-sm">Tanya apa saja tentang layanan kami.</p>
            )}
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.role === 'user' ? 'bg-[#0075d4] text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {m.role === 'user' ? m.content : renderMarkdown(m.content)}
                </div>
              </div>
            ))}
            {chatLoading && streamingContent && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl px-3 py-2 text-sm bg-gray-100 text-gray-800">
                  {renderMarkdown(streamingContent)}
                </div>
              </div>
            )}
            {chatLoading && !streamingContent && (
              <div className="flex justify-start">
                <div className="rounded-xl px-3 py-2 text-sm bg-gray-100 text-gray-500">...</div>
              </div>
            )}
          </div>
          <form onSubmit={sendChatMessage} className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ketik pesan..." className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0075d4]" disabled={chatLoading} />
              <button type="submit" disabled={chatLoading || !chatInput.trim()} className="px-4 py-2 bg-[#0075d4] text-white font-semibold rounded-xl disabled:opacity-50 hover:bg-[#0060b0]">
                Kirim
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
