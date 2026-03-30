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
  const [stats, setStats] = useState({
    doodstream: 0,
    streamtape: 0,
    users: 0
  })
  const [trending, setTrending] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch Counts
        const [doodRes, tapeRes, userRes] = await Promise.all([
          supabase.from('server_2').select('*', { count: 'exact', head: true }),
          supabase.from('server_1').select('*', { count: 'exact', head: true }),
          supabase.from('users').select('*', { count: 'exact', head: true })
        ])

        setStats({
          doodstream: doodRes.count || 0,
          streamtape: tapeRes.count || 0,
          users: userRes.count || 0
        })

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

  const statCards = [
    { name: 'Total Doodstream', value: stats.doodstream.toLocaleString('id-ID'), icon: MonitorPlay, color: 'text-orange-400', bg: 'bg-orange-400/10', change: 'Files' },
    { name: 'Total Streamtape', value: stats.streamtape.toLocaleString('id-ID'), icon: Video, color: 'text-blue-400', bg: 'bg-blue-400/10', change: 'Files' },
    { name: 'Total Registered Users', value: stats.users.toLocaleString('id-ID'), icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10', change: 'Users' }
  ]

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse"></div>
             ))
        ) : (
          statCards.map((stat) => (
            <div key={stat.name} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-indigo-500/50 transition-all duration-500 group cursor-default shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className="w-20 h-20" />
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl ring-1 ring-white/5`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full">{stat.change}</span>
              </div>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">{stat.name}</p>
              <p className="text-4xl font-black text-white tracking-tighter italic leading-none group-hover:text-indigo-400 transition-colors duration-300">{stat.value}</p>
            </div>
          ))
        )}
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
