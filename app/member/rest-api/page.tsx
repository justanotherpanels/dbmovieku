'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Terminal, 
  Copy, 
  Code2,
  Globe,
  Database
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { useLanguage } from '@/context/LanguageContext'

export default function RestApiDocs() {
  const { t } = useLanguage()
  const [profile, setProfile] = useState<any>(null)
  const [host, setHost] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setHost(window.location.origin)
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('users')
        .select('apikey')
        .eq('id', user.id)
        .single()
      setProfile(data)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t('copy_success'))
  }

  if (!mounted) return null

  const exampleResponse = `{
  "status": "success",
  "data": [
    {
      "id": "...",
      "title": "Movie Title",
      "link": "https://streamtape.com/e/...",
      "size_bytes": 1073741824,
      "views": 1502,
      "created_at": "2026-03-25T15:20:00Z"
    }
  ]
}`

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      <Toaster richColors position="top-right" />
      
      {/* Header Utama */}
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-8">
         <div className="bg-indigo-600/10 p-4 rounded-2xl border border-indigo-500/20">
            <Terminal className="w-10 h-10 text-indigo-500" />
         </div>
         <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">REST API</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] pl-1">{t('api_docs_title')}</p>
         </div>
      </div>


      {/* Main Endpoint Table */}
      <div className="bg-zinc-900 rounded-[32px] overflow-hidden border border-zinc-800 shadow-2xl">
         <div className="px-8 py-6 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
            <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
               <Globe className="w-4 h-4 text-indigo-500" /> {t('api_endpoints_title')}
            </h4>
            <span className="text-[10px] text-zinc-500 font-bold">{t('api_base_url')}: {host}</span>
         </div>
         
         <div className="divide-y divide-zinc-800">
            {/* GET Files */}
            <div className="p-8 space-y-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                     <span className="bg-emerald-600/10 text-emerald-500 text-[9px] font-black px-2 py-0.5 rounded border border-emerald-500/20 uppercase">GET</span>
                     <h5 className="text-white font-black text-lg tracking-tight">/api/files</h5>
                  </div>
               </div>

               <p className="text-zinc-500 text-xs font-medium max-w-2xl leading-relaxed">{t('api_get_files_desc')}</p>

               <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                     <span>{t('api_url_endpoint')}</span>
                     <button onClick={() => copyToClipboard(`${host}/api/files?apikey=${profile?.apikey}`)} className="text-indigo-500 hover:text-indigo-400">Copy URL</button>
                  </div>
                  <code className="block text-zinc-300 font-mono text-xs break-all lowercase">
                    {host}/api/files?apikey={profile?.apikey || 'YOUR_API_KEY'}
                  </code>
               </div>

               <div className="space-y-4">
                  <h6 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{t('api_response_body')}</h6>
                  <pre className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl font-mono text-[11px] text-emerald-500/80 leading-relaxed overflow-x-auto">
                     {exampleResponse}
                  </pre>
               </div>
            </div>
         </div>
      </div>

      {/* Parameters */}
      <div className="bg-zinc-900 rounded-[32px] p-10 border border-zinc-800 shadow-2xl">
         <div className="flex items-center gap-3 border-b border-zinc-800 pb-6 mb-8">
            <Database className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest uppercase italic">{t('api_query_params')}</h3>
         </div>
         <table className="w-full text-left">
            <thead>
               <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] border-b border-zinc-800/60 pb-4">
                  <th className="pb-4 font-black">{t('api_param_name')}</th>
                  <th className="pb-4 font-black">{t('api_param_type')}</th>
                  <th className="pb-4 font-black">{t('api_param_req')}</th>
                  <th className="pb-4 font-black">{t('api_param_desc')}</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
               <tr className="group">
                  <td className="py-6 font-mono text-xs text-indigo-400">apikey</td>
                  <td className="py-6 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">String</td>
                  <td className="py-6"><span className="text-[8px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/10">REQUIRED</span></td>
                  <td className="py-6 text-xs text-zinc-500">{t('api_key_required_desc')}</td>
               </tr>
            </tbody>
         </table>
      </div>
    </div>
  )
}
