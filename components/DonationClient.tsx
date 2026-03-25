'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Heart, 
  QrCode, 
  Bitcoin, 
  CreditCard,
  Wallet,
  Mail,
  Copy,
  Check
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { toast } from 'sonner'

interface Donation {
  id: string
  type: 'Qris' | 'Crypto' | 'Paypal'
  detail_donation: any
  create_at: string
}

export default function DonationClient() {
  const { lang } = useLanguage()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('donation')
      .select('*')
      .order('create_at', { ascending: false })
    
    setDonations(data || [])
    setLoading(false)
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success(lang === 'ID' ? 'Berhasil disalin!' : 'Copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'Qris': return <QrCode className="w-8 h-8 text-emerald-500" />
      case 'Crypto': return <Bitcoin className="w-8 h-8 text-orange-500" />
      case 'Paypal': return <CreditCard className="w-8 h-8 text-blue-500" />
      default: return <Heart className="w-8 h-8 text-rose-500" />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <Heart className="w-4 h-4 fill-current" />
            {lang === 'ID' ? 'Dukung Kami' : 'Support Us'}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
            Make a <span className="text-indigo-500 text-white shadow-indigo-500/10">Difference</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-sm md:text-base leading-relaxed">
            {lang === 'ID' 
              ? 'Kontribusi Anda membantu kami menjaga server tetap berjalan, mengembangkan fitur baru, dan memberikan pengalaman streaming terbaik tanpa iklan yang mengganggu.' 
              : 'Your contribution helps us keep the servers running, develop new features, and provide the best streaming experience without intrusive ads.'}
          </p>
        </div>

        {/* Donation Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 bg-zinc-900/50 rounded-[32px] animate-pulse border border-zinc-800" />
            ))
          ) : donations.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-4 bg-zinc-900/30 rounded-[32px] border border-dashed border-zinc-800">
              <div className="p-4 bg-zinc-900 rounded-full w-fit mx-auto">
                <Heart className="w-8 h-8 text-zinc-700" />
              </div>
              <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">
                {lang === 'ID' ? 'Metode donasi belum tersedia.' : 'Donation methods are not available yet.'}
              </p>
            </div>
          ) : (
            donations.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col"
              >
                {/* Header Card */}
                <div className="p-8 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-800 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase italic tracking-tight">{item.type}</h3>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        {lang === 'ID' ? 'Metode Pembayaran' : 'Payment Method'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Card */}
                <div className="p-8 pt-4 flex-1 flex flex-col justify-center">
                  {item.type === 'Qris' && (
                    <div className="space-y-6">
                      <div className="aspect-square bg-white p-4 rounded-2xl overflow-hidden shadow-2xl">
                        <img 
                          src={item.detail_donation?.image_url} 
                          alt="QRIS" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        Scan with your banking app or e-wallet
                      </p>
                    </div>
                  )}

                  {item.type === 'Paypal' && (
                    <div className="space-y-6">
                      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center gap-4 text-center">
                        <Mail className="w-10 h-10 text-blue-500" />
                        <div className="space-y-1">
                          <p className="text-xs text-zinc-500 uppercase font-black tracking-widest">PayPal Account</p>
                          <p className="text-sm font-bold text-white break-all">{item.detail_donation?.email}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleCopy(item.detail_donation?.email, item.id)}
                        className="w-full h-12 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedId === item.id ? (lang === 'ID' ? 'Berhasil Sip!' : 'Copied!') : (lang === 'ID' ? 'Salin Email' : 'Copy Email')}
                      </button>
                    </div>
                  )}

                  {item.type === 'Crypto' && (
                    <div className="space-y-6">
                      {item.detail_donation?.image_url && (
                        <div className="aspect-square bg-zinc-950 border border-zinc-800 p-4 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                          <img 
                            src={item.detail_donation?.image_url} 
                            alt="Crypto QR" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      
                      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center gap-4 text-center">
                        <Wallet className="w-10 h-10 text-orange-500" />
                        <div className="space-y-1 w-full">
                          <p className="text-xs text-zinc-500 uppercase font-black tracking-widest">Wallet Address</p>
                          <p className="text-[10px] font-mono text-zinc-300 break-all bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50 mt-2">
                            {item.detail_donation?.address}
                          </p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleCopy(item.detail_donation?.address, item.id)}
                        className="w-full h-12 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedId === item.id ? (lang === 'ID' ? 'Berhasil!' : 'Copied!') : (lang === 'ID' ? 'Salin Address' : 'Copy Address')}
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer Card */}
                <div className="p-8 pt-0 mt-auto">
                   <div className="h-[1px] w-full bg-zinc-800 mb-6" />
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter italic">Secured Transaction</span>
                      <Heart className="w-4 h-4 text-zinc-800 fill-current" />
                   </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Extra Info */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 md:gap-20">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
              {lang === 'ID' ? 'Kenapa Kami Membutuhkan Anda' : 'Why We Need You'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Server Cost', desc: 'Powerful high-speed storage.', id: 'ID_1', en: 'High bandwidth server costs.' },
                { title: 'Development', desc: 'Updates & new capabilities.', id: 'ID_2', en: 'Continuous platform improvement.' },
                { title: 'Maintenance', desc: '24/7 Uptime & stability.', id: 'ID_3', en: 'Daily operational maintenance.' },
                { title: 'Community', desc: 'Support & engagement help.', id: 'ID_4', en: 'Grow the creator community.' }
              ].map((benefit, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">{benefit.title}</p>
                  <p className="text-zinc-500 text-xs">
                    {lang === 'ID' ? benefit.desc : benefit.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-600 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-40 h-40 bg-zinc-950 border border-zinc-800 rounded-[40px] flex items-center justify-center rotate-6 group-hover:rotate-12 transition-transform duration-500">
              <Heart className="w-16 h-16 text-rose-500 fill-current animate-pulse" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
