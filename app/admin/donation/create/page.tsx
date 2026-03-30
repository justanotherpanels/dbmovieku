'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Heart, 
  ChevronLeft, 
  Save, 
  QrCode, 
  Bitcoin, 
  CreditCard,
  Link as LinkIcon,
  Mail,
  Wallet,
  Coins,
  Network
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import Link from 'next/link'

export default function CreateDonation() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'Qris' | 'Crypto' | 'Paypal'>('Qris')
  
  // States untuk field spesifik
  const [qrisUrl, setQrisUrl] = useState('')
  const [paypalEmail, setPaypalEmail] = useState('')
  const [cryptoUrl, setCryptoUrl] = useState('')
  const [cryptoAddress, setCryptoAddress] = useState('')
  const [cryptoName, setCryptoName] = useState('')
  const [cryptoNetwork, setCryptoNetwork] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let detailObj = {}
    if (type === 'Qris') {
      detailObj = { image_url: qrisUrl }
    } else if (type === 'Paypal') {
      detailObj = { email: paypalEmail }
    } else if (type === 'Crypto') {
      detailObj = { image_url: cryptoUrl, address: cryptoAddress, name: cryptoName, network: cryptoNetwork }
    }

    const { error } = await supabase
      .from('donation')
      .insert([{ 
        type: type, 
        detail_donation: detailObj 
      }])

    if (!error) {
      toast.success('Donasi berhasil ditambahkan')
      setTimeout(() => router.push('/admin/donation'), 1500)
    } else {
      toast.error('Gagal menambahkan donasi: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-8 pt-0 pb-20">
      <Toaster richColors position="top-right" />
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/donation"
          className="h-10 w-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all shadow-xl"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-current" /> Add New Donation
          </h1>
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest leading-none">Structured Data Entry</p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl p-10 space-y-10">
        
        {/* Method Switcher */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Select Payment Method</label>
          <div className="grid grid-cols-3 gap-4">
             {[
               { id: 'Qris', icon: QrCode, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
               { id: 'Paypal', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
               { id: 'Crypto', icon: Bitcoin, color: 'text-orange-500', bg: 'bg-orange-500/10' }
             ].map((method) => (
               <button
                 key={method.id}
                 type="button"
                 onClick={() => setType(method.id as any)}
                 className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all gap-3 ${
                   type === method.id 
                   ? 'bg-zinc-800 border-indigo-500/50 shadow-inner scale-[1.02]' 
                   : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                 }`}
               >
                  <div className={`p-3 rounded-xl ${method.bg}`}>
                     <method.icon className={`w-6 h-6 ${method.color}`} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${type === method.id ? 'text-white' : 'text-zinc-500'}`}>
                     {method.id}
                  </span>
               </button>
             ))}
          </div>
        </div>

        {/* Dynamic Fields */}
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
           {type === 'Qris' && (
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                       <LinkIcon className="w-3 h-3" /> URL Gambar QRIS
                    </label>
                    <input 
                      type="url"
                      required
                      placeholder="https://example.com/qris.png"
                      value={qrisUrl}
                      onChange={(e) => setQrisUrl(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                 </div>
              </div>
           )}

           {type === 'Paypal' && (
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                       <Mail className="w-3 h-3" /> Email PayPal
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder="email@paypal.com"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-bold"
                    />
                 </div>
              </div>
           )}

           {type === 'Crypto' && (
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                          <Coins className="w-3 h-3" /> Nama Crypto
                       </label>
                       <input 
                         type="text"
                         required
                         placeholder="cth: Bitcoin, USDT, ETH"
                         value={cryptoName}
                         onChange={(e) => setCryptoName(e.target.value)}
                         className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                          <Network className="w-3 h-3" /> Nama Jaringan
                       </label>
                       <input 
                         type="text"
                         required
                         placeholder="cth: BEP-20, ERC-20, TRC-20"
                         value={cryptoNetwork}
                         onChange={(e) => setCryptoNetwork(e.target.value)}
                         className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                       <LinkIcon className="w-3 h-3" /> URL Gambar Crypto (Logo/QR)
                    </label>
                    <input 
                      type="url"
                      required
                      placeholder="https://example.com/crypto-qr.png"
                      value={cryptoUrl}
                      onChange={(e) => setCryptoUrl(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                       <Wallet className="w-3 h-3" /> Address Crypto
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="0x... / bc1..."
                      value={cryptoAddress}
                      onChange={(e) => setCryptoAddress(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                    />
                 </div>
              </div>
           )}
        </div>

        {/* Action Button */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
        >
          <Save className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? 'Processing...' : 'Save Donation Method'}
        </button>

      </form>
    </div>
  )
}
