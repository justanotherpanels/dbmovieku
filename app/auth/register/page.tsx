'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User,
  ArrowRight, 
  Loader2,
  Zap,
  ChevronLeft,
  Play
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { useLanguage } from '@/context/LanguageContext'

export default function Register() {
  const { lang, setLang, t } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [siteData, setSiteData] = useState({ name: t('create_account'), logo: '' })
  const router = useRouter()

  useEffect(() => {
    const fetchSiteData = async () => {
      const { data } = await supabase.from('setting_site').select('name, logo').limit(1).single()
      if (data) setSiteData({ name: data.name, logo: data.logo })
    }
    fetchSiteData()
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()
      if (res.ok) {
        toast.success(t('reg_success'))
        setTimeout(() => router.push('/auth/login'), 2000)
      } else {
        toast.error(data.message || 'Pendaftaran gagal')
      }
    } catch (err: any) {
      toast.error('Gagal terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-vh-screen bg-black p-4 min-h-screen relative overflow-hidden group">
      <Toaster richColors position="top-right" />
      
      {/* Language Toggle */}
      <div className="absolute top-8 right-8 z-20 flex bg-zinc-900 shadow-2xl rounded-full p-1 border border-zinc-800 text-[10px] font-black">
        <button 
          onClick={() => setLang('ID')}
          className={`px-3 py-1.5 rounded-full transition-all ${lang === 'ID' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          ID
        </button>
        <button 
          onClick={() => setLang('EN')}
          className={`px-3 py-1.5 rounded-full transition-all ${lang === 'EN' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          EN
        </button>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[120px]"></div>

      <div className="bg-zinc-900 border border-zinc-800 shadow-2xl rounded-[40px] p-10 max-w-md w-full relative z-10 backdrop-blur-xl bg-opacity-80">
        
        <div className="text-center mb-10 space-y-6">
           <div className="mx-auto w-24 h-24 flex items-center justify-center">
              {siteData.logo ? (
                 <img src={siteData.logo} alt="Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center shadow-purple-600/30">
                  <Play className="text-white w-8 h-8 fill-current" />
                </div>
              )}
           </div>
           <div>
             <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic line-clamp-1">{siteData.name}</h2>
             <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-2 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" /> {t('instant_acc')}
             </p>
           </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
           <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{t('full_identity')}</label>
            <div className="relative group/input">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within/input:text-purple-400">
                  <User className="w-5 h-5" />
               </div>
               <input 
                type="text" 
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500/50 outline-none text-zinc-100 transition-all font-medium text-sm"
                placeholder={t('full_name')}
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{t('email_address')}</label>
            <div className="relative group/input">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within/input:text-purple-400">
                  <Mail className="w-5 h-5" />
               </div>
               <input 
                type="email" 
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500/50 outline-none text-zinc-100 transition-all font-medium text-sm"
                placeholder="email@example.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{t('password')}</label>
            <div className="relative group/input">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within/input:text-purple-400">
                  <Lock className="w-5 h-5" />
               </div>
               <input 
                type="password" 
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500/50 outline-none text-zinc-100 transition-all font-medium text-sm"
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 active:scale-95 uppercase tracking-tighter text-lg flex items-center justify-center gap-3 mt-4"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                {t('reg_now')}
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center space-y-4 text-zinc-600 text-xs font-bold uppercase tracking-tight">
           <Link href="/auth/login" className="group text-purple-400 font-black flex items-center justify-center gap-2 uppercase tracking-widest text-[11px] hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t('return_login')}
           </Link>
        </div>
      </div>
    </div>
  )
}
