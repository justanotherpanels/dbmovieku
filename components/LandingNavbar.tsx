'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Play } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function LandingNavbar() {
  const { lang, setLang, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [siteData, setSiteData] = useState({ name: 'MovieDB', logo: '' })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userLevel, setUserLevel] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    
    const checkAuth = () => {
      const cookies = document.cookie.split('; ')
      const levelCookie = cookies.find(row => row.startsWith('user_level='))
      if (levelCookie) {
        setIsLoggedIn(true)
        setUserLevel(levelCookie.split('=')[1])
      }
    }
    checkAuth()

    const fetchSite = async () => {
      const { data } = await supabase.from('setting_site').select('name, logo').limit(1).single()
      if (data) setSiteData({ name: data.name, logo: data.logo })
    }
    fetchSite()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 h-20' : 'h-24'}`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center">
            {siteData.logo ? (
              <img src={siteData.logo} alt="Logo" className="h-12 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  <Play className="text-white w-5 h-5 fill-current" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic">{siteData.name}</span>
              </div>
            )}
        </Link>

        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <a href="/#features" className="hover:text-white transition-colors">{lang === 'ID' ? 'Fitur' : 'Features'}</a>
          <a href="/#api" className="hover:text-white transition-colors">API</a>
          <Link href="/page/donation" className="hover:text-white transition-colors">{t('donation')}</Link>
          <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
            <button 
              onClick={() => setLang('ID')}
              className={`px-3 py-1.5 rounded-full transition-all ${lang === 'ID' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:text-zinc-200'}`}
            >
              ID
            </button>
            <button 
              onClick={() => setLang('EN')}
              className={`px-3 py-1.5 rounded-full transition-all ${lang === 'EN' ? 'bg-indigo-600 text-white shadow-lg' : 'hover:text-zinc-200'}`}
            >
              EN
            </button>
          </div>
        </div>

        {isLoggedIn ? (
          <Link 
            href={userLevel === 'admin' ? '/admin' : '/member'} 
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
          >
            Dashboard
          </Link>
        ) : (
          <Link href="/auth/login" className="bg-white text-black px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/10">
            {lang === 'ID' ? 'Mulai Sekarang' : 'Get Started'}
          </Link>
        )}
      </div>
    </nav>
  )
}
