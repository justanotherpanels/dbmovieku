import { 
  Play, 
  Download, 
  Users, 
  Activity, 
  TrendingUp, 
  Settings as SettingsIcon,
  ChevronRight,
  Database
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Streaming', value: '1,234', change: '+12%', icon: Play, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { name: 'Total Download', value: '856', change: '+5.4%', icon: Download, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Total Users', value: '432', change: '+18.2%', icon: Users, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'Server Status', value: 'Online', change: '99.9%', icon: Activity, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ]

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="relative group max-w-4xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-10 ring-1 ring-white/10 flex flex-col md:flex-row items-center justify-between overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Selamat Datang, Admin!</h1>
            <p className="text-zinc-400 text-lg leading-relaxed">Kelola penyedia streaming dan download film Anda dengan mudah dari panel ini.</p>
          </div>
          <div className="mt-8 md:mt-0 opacity-20 pointer-events-none transform group-hover:scale-110 transition-all duration-700">
            <TrendingUp className="w-40 h-40 text-indigo-500 stroke-[1px]" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-1">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-all duration-300 group cursor-default">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <p className="text-zinc-400 text-sm font-medium mb-1">{stat.name}</p>
            <p className="text-2xl font-bold text-white tracking-tight leading-none group-hover:text-indigo-400 transition-colors duration-300">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Actions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Streaming Section */}
        <div className="group bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
          <div className="absolute -right-16 -top-16 bg-indigo-500/5 w-64 h-64 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-500/20 rounded-2xl">
              <Play className="text-indigo-400 w-8 h-8 font-bold" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">Penyedia Streaming</h3>
              <p className="text-zinc-500 text-sm font-medium">Streamtape, Doodstream, dll.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link href="/admin/streaming" className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 hover:bg-zinc-800/50 transition-all duration-300 group/item shadow-inner">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-indigo-400" />
                <span className="text-zinc-300 font-semibold text-sm">Kelola API Server</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover/item:text-indigo-400 group-hover/item:translate-x-1 transition-all duration-300" />
            </Link>
            <Link href="/admin/streaming/logs" className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 hover:bg-zinc-800/50 transition-all duration-300 group/item">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span className="text-zinc-300 font-semibold text-sm">Log Streaming</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover/item:text-indigo-400 group-hover/item:translate-x-1 transition-all duration-300" />
            </Link>
          </div>
        </div>

        {/* Download Section */}
        <div className="group bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
          <div className="absolute -right-16 -top-16 bg-emerald-500/5 w-64 h-64 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-emerald-500/20 rounded-2xl">
              <Download className="text-emerald-400 w-8 h-8" />
            </div>
            <div className="flex flex-col text-left">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">Penyedia Download</h3>
              <p className="text-zinc-500 text-sm font-medium">Kelola storage dan traffic.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link href="/admin/download" className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 hover:bg-zinc-800/50 transition-all duration-300 group/item shadow-inner">
              <div className="flex items-center gap-3">
                <SettingsIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-zinc-300 font-semibold text-sm">Pengaturan Server Download</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover/item:text-emerald-400 group-hover/item:translate-x-1 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
