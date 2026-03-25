'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Heart, 
  Trash2, 
  QrCode, 
  Bitcoin, 
  CreditCard, 
  Plus,
  Edit3
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import Link from 'next/link'

interface Donation {
  id: string
  type: 'Qris' | 'Crypto' | 'Paypal'
  detail_donation: any
  create_at: string
}

export default function DonationManager() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

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

  const handleDelete = async (id: string) => {
     if (confirm('Hapus data donasi ini?')) {
        const { error } = await supabase.from('donation').delete().eq('id', id)
        if (!error) {
           toast.success('Donasi berhasil dihapus')
           fetchDonations()
        }
     }
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'Qris': return <QrCode className="w-5 h-5 text-emerald-500" />
      case 'Crypto': return <Bitcoin className="w-5 h-5 text-orange-500" />
      case 'Paypal': return <CreditCard className="w-5 h-5 text-blue-500" />
      default: return <Heart className="w-5 h-5 text-rose-500" />
    }
  }

  return (
    <div className="space-y-8 p-8 pt-0 pb-20">
      <Toaster richColors position="top-right" />
      
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
           <Heart className="w-8 h-8 text-rose-500 fill-current" /> List Donation
        </h1>

        <Link
          href="/admin/donation/create"
          className="h-12 px-6 flex items-center justify-center gap-2 bg-indigo-600 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
        >
           <Plus className="w-4 h-4" /> Add New
        </Link>
      </div>

      {/* Main Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-zinc-800/50 border-b border-zinc-800">
                  <tr>
                     <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest w-24">Method</th>
                     <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Transaction Details</th>
                     <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest w-40">Date</th>
                     <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest w-16 text-center text-zinc-500">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-800/60">
                  {loading ? (
                     <tr><td colSpan={4} className="px-6 py-10 text-center text-xs animate-pulse text-zinc-600">Loading data...</td></tr>
                  ) : donations.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-20 text-center text-[10px] font-black text-zinc-600 uppercase">Belum ada data donasi.</td></tr>
                  ) : (
                    donations.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-950/40 transition-colors">
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                               {getIcon(item.type)}
                               <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.type}</span>
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <code className="text-zinc-400 font-mono text-[11px] break-all">
                               {JSON.stringify(item.detail_donation)}
                            </code>
                         </td>
                         <td className="px-6 py-5">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase italic">
                               {new Date(item.create_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                         </td>
                         <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-2">
                               <Link 
                                 href={`/admin/donation/edit/${item.id}`}
                                 className="p-2 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
                               >
                                  <Edit3 className="w-4 h-4" />
                               </Link>
                               <button 
                                 onClick={() => handleDelete(item.id)} 
                                 className="p-2 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                               >
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
