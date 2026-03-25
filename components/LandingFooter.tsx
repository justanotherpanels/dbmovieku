'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Play, Globe } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function LandingFooter() {
  const { lang, setLang } = useLanguage()
  const [siteData, setSiteData] = useState({ name: 'MovieDB', logo: '' })

  useEffect(() => {
    const fetchSite = async () => {
      const { data } = await supabase.from('setting_site').select('name, logo').limit(1).single()
      if (data) setSiteData({ name: data.name, logo: data.logo })
    }
    fetchSite()
  }, [])

  return (
    <footer className="py-12 px-6 border-t border-zinc-900 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Logo Slim */}
        <div className="flex items-center grayscale opacity-40 hover:opacity-100 transition-opacity duration-500">
           {siteData.logo ? (
             <img src={siteData.logo} alt="Logo" className="h-8 w-auto object-contain" />
           ) : (
              <div className="flex items-center gap-2">
                <div className="bg-zinc-800 p-1.5 rounded-lg text-white">
                   <Play className="w-4 h-4 fill-current" />
                </div>
                <span className="text-lg font-black tracking-tighter uppercase italic text-zinc-400">{siteData.name}</span>
              </div>
           )}
        </div>

        {/* Copyright Compact */}
        <div className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.3em] text-center md:text-left">
           &copy; 2026 {siteData.name}. <span className="text-zinc-800 ml-1">{lang === 'ID' ? 'Sesuai Ketentuan Layanan.' : 'Terms of Service Apply.'}</span>
        </div>

        {/* Lang Switcher Slim */}
        <div className="flex items-center gap-6">
           <Globe className="w-3.5 h-3.5 text-zinc-800" />
           <div className="flex gap-4 text-[9px] font-black uppercase text-zinc-700">
              <button 
                onClick={() => setLang('ID')} 
                className={`py-1 hover:text-white transition-colors border-b-2 ${lang === 'ID' ? 'border-indigo-600 text-white' : 'border-transparent'}`}
              >
                ID
              </button>
              <button 
                onClick={() => setLang('EN')} 
                className={`py-1 hover:text-white transition-colors border-b-2 ${lang === 'EN' ? 'border-indigo-600 text-white' : 'border-transparent'}`}
              >
                EN
              </button>
           </div>
        </div>
      </div>
    </footer>
  )
}
