'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Heart, 
  QrCode, 
  Bitcoin, 
  CreditCard,
  Copy,
  Mail,
  Wallet,
  ShieldCheck
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { useLanguage } from '@/context/LanguageContext'

interface DonationMethod {
  id: string
  type: 'Qris' | 'Crypto' | 'Paypal'
  detail_donation: any
}

export default function DonationPage() {
  const { t } = useLanguage()
  const [methods, setMethods] = useState<DonationMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchMethods()
  }, [])

  const fetchMethods = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('donation')
      .select('*')
      .order('create_at', { ascending: true })

    setMethods(data || [])
    setLoading(false)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t('copy_success') || 'Copied!')
  }

  if (!mounted) return null

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <Toaster richColors position="top-right" />
      
      {/* Compact Hero Section */}
      <div className="relative p-8 bg-zinc-900/40 border border-zinc-800/60 rounded-[32px] overflow-hidden group">
         <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-indigo-600 rounded-[32px] blur opacity-5"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
               <Heart className="w-8 h-8 text-rose-500 fill-current" />
            </div>
            <div className="text-center md:text-left space-y-2">
               <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic italic line-height-none">Support Our Projects</h1>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-xl">
                 Bantu operasional server kami tetap stabil dengan berdonasi melalui metode di bawah ini.
               </p>
            </div>
         </div>
      </div>

      {/* Grid Donation Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
         {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="bg-zinc-900 border border-zinc-800 h-80 rounded-[32px] animate-pulse"></div>
            ))
         ) : methods.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-zinc-900 border border-zinc-800 rounded-[32px]">
               <ShieldCheck className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
               <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Belum ada metode donasi aktif.</p>
            </div>
         ) : (
            methods.map((method) => (
               <div key={method.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl hover:border-indigo-500/40 transition-all duration-500 flex flex-col">
                  
                  {/* Icon Header */}
                  <div className="flex items-center justify-between mb-8">
                     <div className={`p-3.5 rounded-2xl border ${
                        method.type === 'Qris' ? 'bg-emerald-500/10 border-emerald-500/20' :
                        method.type === 'Paypal' ? 'bg-blue-500/10 border-blue-500/20' :
                        'bg-orange-500/10 border-orange-500/20'
                     }`}>
                        {method.type === 'Qris' && <QrCode className="w-6 h-6 text-emerald-500" />}
                        {method.type === 'Paypal' && <CreditCard className="w-6 h-6 text-blue-500" />}
                        {method.type === 'Crypto' && <Bitcoin className="w-6 h-6 text-orange-500" />}
                     </div>
                     <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{method.type}</span>
                  </div>

                  {/* Content per Type */}
                  <div className="flex-1 space-y-6">
                     <h3 className="text-xl font-black text-white italic tracking-tight">{method.type} Method</h3>
                     
                     {method.type === 'Qris' && (
                        <div className="space-y-4">
                           <div className="aspect-square bg-white p-3 rounded-2xl overflow-hidden shadow-inner">
                              <img 
                                src={method.detail_donation.image_url} 
                                alt="QRIS" 
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                              />
                           </div>
                        </div>
                     )}

                     {method.type === 'Paypal' && (
                        <div className="space-y-4">
                           <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                              <div className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                                 <Mail className="w-3 h-3" /> PayPal Email
                              </div>
                              <div className="flex items-center justify-between py-1">
                                 <span className="text-xs font-mono text-blue-400 truncate pr-4">{method.detail_donation.email}</span>
                                 <button 
                                   onClick={() => handleCopy(method.detail_donation.email)}
                                   className="text-zinc-600 hover:text-white transition-colors"
                                 >
                                    <Copy className="w-4 h-4" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     )}

                     {method.type === 'Crypto' && (
                        <div className="space-y-4">
                           {method.detail_donation.image_url && (
                             <div className="aspect-square bg-white p-3 rounded-2xl overflow-hidden shadow-inner">
                                <img 
                                  src={method.detail_donation.image_url} 
                                  alt="Crypto QR" 
                                  className="w-full h-full object-contain"
                                />
                             </div>
                           )}
                           <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                              <div className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                                 <Wallet className="w-3 h-3" /> Address
                              </div>
                              <div className="flex items-center justify-between py-1">
                                 <p className="text-[10px] font-mono text-orange-400 break-all leading-relaxed flex-1 pr-4 italic">
                                    {method.detail_donation.address}
                                 </p>
                                 <button 
                                   onClick={() => handleCopy(method.detail_donation.address)}
                                   className="text-zinc-600 hover:text-white transition-colors p-1 shrink-0"
                                 >
                                    <Copy className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Copy Button */}
                  <button 
                    onClick={() => {
                      const copyText = method.type === 'Paypal' ? method.detail_donation.email : (method.detail_donation.address || method.type);
                      handleCopy(copyText);
                    }}
                    className="mt-8 w-full h-10 flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all font-black uppercase text-[9px] tracking-widest"
                  >
                     Copy Details <Copy className="w-3 h-3" />
                  </button>
               </div>
            ))
         )}
      </div>

      <div className="pt-10 flex justify-center opacity-20 select-none grayscale">
         <ShieldCheck className="w-10 h-10" />
      </div>
    </div>
  )
}
