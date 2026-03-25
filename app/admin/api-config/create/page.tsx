'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Save, 
  Webhook, 
  Database,
  Lock,
  User,
  Info
} from 'lucide-react'

export default function CreateApiConfig() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('Streamtape')
  
  // Fields for Streamtape
  const [streamLogin, setStreamLogin] = useState('')
  const [streamKey, setStreamKey] = useState('')
  
  // Fields for Doodstream
  const [doodKey, setDoodKey] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let configObj = {}
      if (type === 'Streamtape') {
        configObj = { login: streamLogin, key: streamKey }
      } else {
        configObj = { apikey: doodKey }
      }

      const { error } = await supabase
        .from('api_server')
        .insert([{
          type: type as any,
          api_config: configObj
        }])

      if (error) throw error

      toast.success('Konfigurasi ' + type + ' berhasil ditambahkan!')
      setTimeout(() => router.push('/admin/api-config'), 1500)
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan konfigurasi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/api-config" className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-400" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/20 p-2 rounded-xl">
            <Webhook className="text-indigo-400 w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Tambah API Server</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Tipe Server */}
          <div className="space-y-6">
            <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 space-y-4 shadow-inner">
               <h3 className="text-lg font-bold text-zinc-300 flex items-center gap-2 mb-2">
                 <Database className="w-5 h-5 text-indigo-400" /> Identitas Server
               </h3>
               <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-400">Pilih Tipe Server</label>
                  <select
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-indigo-500/50 outline-none text-zinc-200 cursor-pointer appearance-none transition-all"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Streamtape">Streamtape</option>
                    <option value="Doodstream">Doodstream</option>
                  </select>
               </div>
               <div className="mt-6 flex items-start gap-3 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                  <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                    Input akan otomatis berubah sesuai dengan kebutuhan API masing-masing provider.
                  </p>
               </div>
            </div>
          </div>

          {/* Dynamic Inputs based on Type */}
          <div className="space-y-6 bg-zinc-950/50 p-8 rounded-3xl border border-zinc-800/50 min-h-[300px] flex flex-col justify-center animate-in fade-in duration-500">
             <h3 className="text-lg font-bold text-zinc-300 flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
               Konfigurasi <span className="text-indigo-400 font-black">{type}</span>
             </h3>

             {type === 'Streamtape' ? (
               <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Login</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-zinc-600" />
                      </div>
                      <input
                        type="text"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 outline-none text-zinc-200"
                        placeholder="Masukkan API Login"
                        value={streamLogin}
                        onChange={(e) => setStreamLogin(e.target.value)}
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Key</label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-zinc-600" />
                      </div>
                      <input
                        type="password"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 outline-none text-zinc-200"
                        placeholder="Masukkan API Key"
                        value={streamKey}
                        onChange={(e) => setStreamKey(e.target.value)}
                      />
                   </div>
                 </div>
               </div>
             ) : (
               <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">API Key</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-zinc-600" />
                      </div>
                      <input
                        type="password"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 outline-none text-zinc-200"
                        placeholder="Masukkan Doodstream API Key"
                        value={doodKey}
                        onChange={(e) => setDoodKey(e.target.value)}
                      />
                    </div>
                 </div>
               </div>
             )}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-end gap-4 border-t border-zinc-800 pt-8">
          <Link href="/admin/api-config" className="px-6 py-3 text-zinc-400 hover:text-white font-bold transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <Save className="w-5 h-5" />}
            Simpan Konfigurasi
          </button>
        </div>
      </form>
    </div>
  )
}
