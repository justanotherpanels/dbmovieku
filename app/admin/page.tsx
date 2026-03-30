'use client'

import { useEffect, useState } from 'react'
import { 
  Play, 
  Download, 
  Users, 
  Activity, 
  TrendingUp, 
  Settings as SettingsIcon,
  ChevronRight,
  Database,
  Film,
  Video,
  MonitorPlay,
  Eye,
  History
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [trending, setTrending] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch Trending (Top 5 Mixed)
        const [doodTrending, tapeTrending] = await Promise.all([
          supabase.from('server_2').select('title, view_count, file_code').order('view_count', { ascending: false }).limit(5),
          supabase.from('server_1').select('file_name, file_download, file_linkid').order('file_download', { ascending: false }).limit(5)
        ])

        const combined = [
          ...(doodTrending.data || []).map(d => ({ 
            title: d.title, 
            views: d.view_count, 
            type: 'Doodstream', 
            id: d.file_code,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10'
          })),
          ...(tapeTrending.data || []).map(t => ({ 
            title: t.file_name, 
            views: t.file_download, 
            type: 'Streamtape', 
            id: t.file_linkid,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
          }))
        ]

        setTrending(combined.sort((a, b) => b.views - a.views).slice(0, 5))

      } catch (err) {
        console.error('Failed to fetch dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Welcome Section */}
      <div className="relative group max-w-4xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-10 ring-1 ring-white/10 flex flex-col md:flex-row items-center justify-between overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase italic">Control Center</h1>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed">Pusat kelola aliran streaming, pengguna, dan optimalkan performa server API Anda.</p>
          </div>
          <div className="mt-8 md:mt-0 opacity-20 pointer-events-none transform group-hover:scale-110 transition-all duration-700">
            <TrendingUp className="w-40 h-40 text-indigo-500 stroke-[1px]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Trending Stream 5 */}
         <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                     <Activity className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                     <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Trending Stream 5</h2>
                     <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Aktivitas penayangan tertinggi</p>
                  </div>
               </div>
               <Link href="/admin/doodstream" className="text-[10px] font-black text-indigo-500 hover:text-white uppercase tracking-widest transition-colors border-b border-indigo-500/30">View All</Link>
            </div>

            <div className="space-y-3">
               {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                     <div key={i} className="h-16 bg-zinc-950 border border-zinc-800 rounded-2xl animate-pulse"></div>
                  ))
               ) : trending.length === 0 ? (
                  <div className="py-10 text-center text-zinc-600 font-bold uppercase tracking-widest text-[10px]">No activity found</div>
               ) : (
                  trending.map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl group hover:border-indigo-500/40 transition-all duration-300 shadow-inner">
                        <div className="flex items-center gap-4 max-w-[70%]">
                           <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center text-xs font-black ${item.color}`}>
                              #{idx + 1}
                           </div>
                           <div className="flex flex-col truncate">
                              <span className="text-white font-bold text-sm truncate tracking-tight">{item.title}</span>
                              <span className={`text-[9px] font-black uppercase tracking-widest ${item.color}`}>{item.type}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 pr-2">
                           <Eye className="w-3.5 h-3.5 text-zinc-600" />
                           <span className="text-white font-black text-sm">{item.views.toLocaleString('id-ID')}</span>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>

         {/* Quick Logs / Server History Placeholder */}
         <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 mb-8">
               <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <History className="w-6 h-6 text-indigo-500" />
               </div>
               <div>
                  <h2 className="text-xl font-black text-white italic uppercase tracking-tight">System Status</h2>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Health & Connectivity Logs</p>
               </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                   <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
                   <Activity className="w-20 h-20 text-emerald-500 relative z-10 animate-pulse" />
                </div>
                <div>
                   <p className="text-xl font-black text-white uppercase italic tracking-tighter">Server All Active</p>
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">99.9% Uptime Stability</p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                   <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-3xl">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Doodstream API</p>
                      <p className="text-emerald-400 font-bold text-xs">CONNECTED</p>
                   </div>
                   <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-3xl">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Streamtape API</p>
                      <p className="text-emerald-400 font-bold text-xs">CONNECTED</p>
                   </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  )
}
