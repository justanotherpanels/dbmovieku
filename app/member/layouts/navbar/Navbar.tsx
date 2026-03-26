'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Play, 
  Search, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react'

import { useLanguage } from '@/context/LanguageContext'

export default function Navbar() {
  const pathname = usePathname()
  const { lang, setLang, t } = useLanguage()
  const [siteData, setSiteData] = useState({ name: 'MovieDB', logo: '' })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkUser = () => {
       const cookies = document.cookie.split('; ')
       const level = cookies.find(r => r.startsWith('user_level='))?.split('=')[1]
       if (level?.toLowerCase() === 'admin') setIsAdmin(true)
    }
    checkUser()

    const fetchSiteData = async () => {
      const { data } = await supabase.from('setting_site').select('name, logo').limit(1).single()
      if (data) setSiteData({ name: data.name, logo: data.logo })
    }
    fetchSiteData()
  }, [])

  const handleLogout = async () => {
    // Clear cookies
    document.cookie = 'user_level=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    window.location.href = '/'
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/member" className="flex items-center gap-3">
          {siteData.logo ? (
            <img src={siteData.logo} alt="Logo" className="h-10 w-auto object-contain" />
          ) : (
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <Play className="text-white w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">{siteData.name}</span>
            </div>
          )}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 px-6 text-sm font-bold text-zinc-400">
          <Link href="/member" className={`hover:text-white transition-colors ${pathname === '/member' ? 'text-white underline decoration-indigo-500 decoration-2 underline-offset-8' : ''}`}>{t('home')}</Link>
          <Link href="/member/trending" className={`hover:text-white transition-colors ${pathname === '/member/trending' ? 'text-white underline decoration-indigo-500 decoration-2 underline-offset-8' : ''}`}>{t('trending')}</Link>
          <Link href="/member/rest-api" className={`hover:text-white transition-colors ${pathname === '/member/rest-api' ? 'text-white underline decoration-indigo-500 decoration-2 underline-offset-8' : ''}`}>{t('api')}</Link>
          <Link href="/member/donation" className={`hover:text-white transition-colors ${pathname === '/member/donation' ? 'text-white underline decoration-indigo-500 decoration-2 underline-offset-8' : ''}`}>{t('donation')}</Link>
        </div>

        {/* Right Section: Search & Profile */}
        <div className="flex items-center gap-4">
           {/* Language Toggle */}
           <div className="flex bg-zinc-950 rounded-full p-1 border border-zinc-900 text-[9px] font-black mr-2">
              <button 
                onClick={() => setLang('ID')}
                className={`px-2.5 py-1 rounded-full transition-all ${lang === 'ID' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-200'}`}
              >
                ID
              </button>
              <button 
                onClick={() => setLang('EN')}
                className={`px-2.5 py-1 rounded-full transition-all ${lang === 'EN' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-200'}`}
              >
                EN
              </button>
           </div>

           {isAdmin && (
             <Link href="/admin" className="hidden lg:flex items-center gap-2 p-1 px-4 bg-emerald-600/10 border border-emerald-500/20 rounded-full hover:bg-emerald-600/20 transition-all mr-2">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">Dashboard</span>
             </Link>
           )}

           <Link href="/member/profile" className="p-2.5 text-zinc-300 hover:bg-zinc-800 rounded-full transition-all group/prof">
             <User className={`w-5 h-5 ${pathname === '/member/profile' ? 'text-indigo-500' : 'group-hover/prof:text-indigo-400'}`} />
           </Link>
           
           <div className="h-8 w-[1px] bg-zinc-800 mx-2 hidden sm:block"></div>
           
           <button 
             onClick={handleLogout}
             className="flex items-center gap-2 group p-1 pr-4 bg-zinc-900 border border-zinc-800 rounded-full hover:border-indigo-500/50 transition-all text-left"
           >
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black italic text-white shadow-lg shadow-indigo-600/30 uppercase">
                {isAdmin ? 'A' : 'M'}
              </div>
              <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest ml-1">{isAdmin ? 'Admin' : 'Member'}</span>
              <LogOut className="w-4 h-4 text-zinc-600 group-hover:text-rose-400 transition-colors ml-2" />
           </button>

           {/* Mobile Menu Toggle */}
           <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-zinc-300">
             {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 p-6 space-y-4 animate-in slide-in-from-top duration-300">
           <Link href="/member" className="block text-zinc-200 font-bold hover:text-indigo-400">Home</Link>
           <Link href="/member/trending" className="block text-zinc-200 font-bold hover:text-indigo-400">Trending</Link>
           <Link href="/member/rest-api" className="block text-zinc-200 font-bold hover:text-indigo-400" onClick={() => setIsMenuOpen(false)}>API</Link>
           <Link href="/member/donation" className="block text-zinc-200 font-bold hover:text-indigo-400" onClick={() => setIsMenuOpen(false)}>{t('donation')}</Link>
           <div className="pt-4 border-t border-zinc-900 flex flex-col gap-4">
              {isAdmin && (
                <Link href="/admin" className="block text-emerald-500 font-bold hover:underline" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-rose-400 w-full text-left"
              >
                <LogOut className="w-4 h-4" /> {t('logout')}
              </button>
           </div>
        </div>
      )}
    </nav>
  )
}
