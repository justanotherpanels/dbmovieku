import Sidebar from './layout/sidebar/Sidebar'
import { Toaster } from 'sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Toaster richColors position="top-right" />
      <Sidebar />
      <main className="flex-1 w-full bg-zinc-950/50 backdrop-blur-3xl overflow-y-auto">
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-10 bg-black/30 sticky top-0 backdrop-blur-md z-10 transition-all duration-300">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white tracking-tight">Admin Dashboard</h2>
            <p className="text-zinc-500 text-xs font-medium">Panel Pengelola Konten & User</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 border border-zinc-800 rounded-full bg-zinc-900/50 hover:bg-zinc-800 transition-all duration-200 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                AD
              </div>
              <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">Super Admin</span>
            </div>
          </div>
        </header>
        
        <div className="p-10 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  )
}
