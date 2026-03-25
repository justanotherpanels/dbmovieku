'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  User, 
  Lock, 
  Key, 
  RefreshCcw, 
  ShieldCheck, 
  Loader2,
  Save,
  Mail
} from 'lucide-react'

import { useLanguage } from '@/context/LanguageContext'

export default function ProfilePage() {
  const { t } = useLanguage()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    // Di client-side kita ambil session saja (Supabase Auth jika sudah terintegrasi)
    // Atau ambil dari table users dengan email/id yang kita punya.
    // Untuk saat ini kita asumsikan user sudah login & kita ambil data user aktif.
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single()
      
      if (data) {
        setUserData(data)
        setName(data.name)
      }
    } else {
        // Fallback jika tidak pakai Supabase Auth (pakai manual users table)
        // Kita butuh ID dari cookie, tapi Client-side tidak bisa akses httpOnly cookie.
        // Solusi: buat API route untuk fetchProfile.
        const res = await fetch('/api/auth/profile')
        const data = await res.json()
        if (res.ok) {
            setUserData(data.user)
            setName(data.user.name)
        }
    }
    setLoading(false)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password: newPassword })
      })
      
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message)
        setNewPassword('')
        fetchProfile()
      } else {
        toast.error(data.message)
      }
    } catch (err: any) {
      toast.error('Gagal memperbarui profil')
    } finally {
      setUpdating(false)
    }
  }

  const handleRegenerateApiKey = async () => {
    if (!confirm('Apakah Anda yakin ingin mengganti API Key? Aplikasi Anda yang lama tidak akan bisa mengakses API.')) return
    
    setRegenerating(true)
    try {
      const res = await fetch('/api/auth/profile/apikey', {
        method: 'POST'
      })
      
      const data = await res.json()
      if (res.ok) {
        toast.success('API Key berhasil diperbarui')
        fetchProfile()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error('Gagal memperbarui API Key')
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 px-1">
      {/* Header */}
      <div className="space-y-2">
         <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            <User className="w-8 h-8 text-indigo-500 fill-current" /> {t('my_profile')}
         </h1>
         <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] pl-1">{t('profile_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left: Account Info & API Key */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-indigo-600/40 border-4 border-black">
                    {userData?.name?.charAt(0).toUpperCase()}
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">{userData?.name}</h2>
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1 flex items-center justify-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-emerald-500" /> {userData?.level} {t('account_info')}
                    </p>
                 </div>
              </div>

              <div className="pt-6 border-t border-zinc-800 space-y-4">
                 <div className="flex items-center gap-3 text-zinc-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold truncate">{userData?.email}</span>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-tr from-zinc-900 to-zinc-950 border border-zinc-800 rounded-[32px] p-8 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
              
              <div className="flex items-center gap-3 mb-2">
                 <Key className="w-5 h-5 text-indigo-500" />
                 <h3 className="text-sm font-black text-white uppercase tracking-widest">Secret API Key</h3>
              </div>
              
              <div className="bg-black border border-zinc-800 rounded-xl p-4 font-mono text-[10px] text-indigo-400 break-all leading-relaxed shadow-inner">
                 {userData?.apikey || 'No API Key found'}
              </div>

              <button 
                onClick={handleRegenerateApiKey}
                disabled={regenerating}
                className="w-full h-11 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                 {regenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                 {t('regenerate_key')}
              </button>
              
              <p className="text-[9px] text-zinc-600 font-bold uppercase text-center leading-relaxed">
                 {t('careful_hint')}
              </p>
           </div>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-10 space-y-10">
              <div className="space-y-8">
                 <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3 italic">
                    <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                    {t('account_settings')}
                 </h3>

                 <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{t('full_name')}</label>
                          <div className="relative group/input">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within/input:text-indigo-400">
                                <User className="w-5 h-5" />
                             </div>
                             <input 
                              type="text" 
                              required
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 outline-none text-zinc-100 transition-all font-medium text-sm"
                              placeholder={t('full_name')}
                              value={name} 
                              onChange={(e) => setName(e.target.value)} 
                            />
                          </div>
                       </div>

                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{t('new_password')}</label>
                          <div className="relative group/input">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within/input:text-indigo-400">
                                <Lock className="w-5 h-5" />
                             </div>
                             <input 
                              type="password" 
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 outline-none text-zinc-100 transition-all font-medium text-sm"
                              placeholder="••••••••"
                              value={newPassword} 
                              onChange={(e) => setNewPassword(e.target.value)} 
                            />
                          </div>
                          <p className="text-[9px] text-zinc-600 font-bold uppercase pl-1">{t('pass_hint')}</p>
                       </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={updating}
                      className="group bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                       {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                       {t('save_changes')}
                    </button>
                 </form>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}
