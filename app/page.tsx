'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  Download, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight,
  Code,
  CheckCircle2,
  Video
} from 'lucide-react'

import { useLanguage } from '@/context/LanguageContext'

export default function LandingPage() {
  const { lang } = useLanguage()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userLevel, setUserLevel] = useState<string | null>(null)
  const [siteName, setSiteName] = useState('MovieDB')

  useEffect(() => {
    // Check Auth session from cookie
    const checkAuth = () => {
      const cookies = document.cookie.split('; ')
      const levelCookie = cookies.find(row => row.startsWith('user_level='))
      if (levelCookie) {
        setIsLoggedIn(true)
        setUserLevel(levelCookie.split('=')[1])
      }
    }
    checkAuth()

    const fetchSetting = async () => {
      const { data } = await supabase.from('setting_site').select('name').limit(1).single()
      if (data?.name) setSiteName(data.name)
    }
    fetchSetting()
  }, [])

  const content = {
    ID: {
      hero: {
        tag: `Pusat Streaming & Download Video No. 1`,
        title: 'Streaming Segalanya, Unduh di Mana Saja.',
        subtitle: `Platform terlengkap untuk menikmati konten video favorit Anda dengan kualitas terbaik dan akses API gratis bagi para developer.`,
        cta: 'Mulai Menonton',
        secondary: 'Pelajari Dok API',
        dashboard: 'Buka Dashboard'
      },
      features: {
        title: 'Mengapa Memilih Kami?',
        list: [
          { title: 'Streaming Tanpa Batas', desc: 'Nikmati ribuan konten video dengan resolusi tinggi tanpa buffering.', icon: Video },
          { title: 'Download Cepat', desc: 'Unduh video favorit Anda secara instan untuk dinikmati secara offline.', icon: Download },
          { title: 'API Powerhouse', desc: `Gunakan REST API terbaik kami untuk membangun aplikasi streaming Anda sendiri.`, icon: Code },
          { title: 'Keamanan Privasi', desc: 'Data Anda aman bersama kami dengan enkripsi tingkat tinggi.', icon: ShieldCheck }
        ]
      },
      api: {
        title: 'REST API Terbaik untuk Developer',
        subtitle: `Kami menyediakan dokumentasi API yang mudah digunakan, cepat, dan 100% gratis untuk diintegrasikan ke platform Anda.`,
        list: ['Dukungan JSON Full', 'Latency Sangat Rendah', 'Dokumentasi Lengkap', 'Gratis Selamanya']
      }
    },
    EN: {
      hero: {
        tag: `No. 1 Video Streaming & Download Hub`,
        title: 'Stream Everything, Download Anywhere.',
        subtitle: `The most comprehensive platform to enjoy your favorite video content with the best quality and free API access for developers.`,
        cta: 'Start Watching',
        secondary: 'Read API Docs',
        dashboard: 'Open Dashboard'
      },
      features: {
        title: 'Why Choose Us?',
        list: [
          { title: 'Unlimited Streaming', desc: 'Enjoy thousands of high-resolution video contents without buffering.', icon: Video },
          { title: 'Fast Downloads', desc: 'Download your favorite videos instantly for offline enjoyment.', icon: Download },
          { title: 'API Powerhouse', desc: `Use our top-tier REST API to build your own streaming application.`, icon: Code },
          { title: 'Privacy First', desc: 'Your data is safe with us using high-level encryption.', icon: ShieldCheck }
        ]
      },
      api: {
        title: 'The Best REST API for Developers',
        subtitle: `We provide easy-to-use, fast, and 100% free API documentation for integration into your platform.`,
        list: ['Full JSON Support', 'Ultra-Low Latency', 'Compete Documentation', 'Free Forever']
      }
    }
  }

  const pageContent = content[lang]

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-60 pb-40 px-6">
        {/* Background Decor */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 pointer-events-none">
           <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[160px] animate-pulse"></div>
           <div className="absolute bottom-40 -right-20 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[160px]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
           <div className="inline-flex items-center gap-2 px-6 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-4 scale-animation">
              <Zap className="w-4 h-4 fill-current animate-bounce" /> {pageContent.hero.tag}
           </div>
           
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-600">
             {pageContent.hero.title}
           </h1>

           <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
             {pageContent.hero.subtitle}
           </p>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              {isLoggedIn ? (
                 <Link href={userLevel === 'admin' ? '/admin' : '/member'} className="group bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/30 flex items-center gap-4 active:scale-95">
                    {pageContent.hero.dashboard}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Link>
              ) : (
                 <Link href="/auth/register" className="group bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/30 flex items-center gap-4 active:scale-95">
                    {pageContent.hero.cta}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Link>
              )}
              <Link href="#api" className="px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all active:scale-95">
                 {pageContent.hero.secondary}
              </Link>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">{pageContent.features.title}</h2>
            <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pageContent.features.list.map((item, idx) => (
              <div key={idx} className="group p-8 bg-zinc-900 border border-zinc-800 rounded-[40px] hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-3 relative overflow-hidden">
                <div className="bg-indigo-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8 text-indigo-500" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-4">{item.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-1000"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Showcase */}
      <section id="api" className="py-40 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-tr from-zinc-950 to-zinc-900 border border-zinc-800 rounded-[50px] p-10 md:p-20 flex flex-col lg:flex-row items-center gap-20 relative overflow-hidden">
          <div className="flex-1 space-y-10 relative z-10">
            <div className="space-y-6">
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight italic">{pageContent.api.title}</h2>
               <p className="text-zinc-500 text-lg font-medium leading-relaxed">{pageContent.api.subtitle}</p>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pageContent.api.list.map((it, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {it}
                </li>
              ))}
            </ul>

            <Link href="/auth/register" className="inline-flex items-center gap-3 text-indigo-400 font-black uppercase tracking-[0.2em] text-xs hover:text-white transition-colors group">
              Get Your API Key Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex-1 w-full max-w-xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative bg-black rounded-3xl p-6 border border-zinc-800 shadow-2xl font-mono text-sm overflow-hidden">
                 <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-rose-500/30"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/30"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/30"></div>
                 </div>
                 <div className="space-y-3 opacity-80">
                    <div className="text-zinc-500">// Fetch Unlimited Content</div>
                    <div className="flex gap-4">
                      <span className="text-purple-500">GET</span>
                      <span className="text-emerald-500">/api/v1/stream</span>
                    </div>
                    <div className="text-zinc-400 pl-4">{'{'}</div>
                    <div className="pl-8 text-indigo-400">"status": <span className="text-amber-500">200</span>,</div>
                    <div className="pl-8 text-indigo-400">"access": <span className="text-amber-500">"granted"</span>,</div>
                    <div className="pl-8 text-indigo-400">"items": [<span className="text-zinc-500">...</span>]</div>
                    <div className="text-zinc-400 pl-4">{'}'}</div>
                 </div>
              </div>
          </div>
        </div>
      </section>

    </div>
  )
}
