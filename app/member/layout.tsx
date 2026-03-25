import Navbar from './layouts/navbar/Navbar'
import { supabase } from '@/lib/supabase'

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data } = await supabase.from('setting_site').select('name').limit(1).single()
  const siteName = data?.name || 'MovieDB'

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <main className="pt-20 min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-950 via-black to-zinc-950/20">
        <div className="max-w-[1400px] mx-auto p-10 mt-6 overflow-hidden">
          {children}
        </div>
      </main>

      <footer className="mt-20 border-t border-zinc-900 bg-black/50 py-10 px-6 backdrop-blur-md">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
              &copy; 2026 {siteName}. Built for High Resilience.
            </div>
            <div className="flex items-center gap-6 text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">
              <a href="/page/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/page/policy" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/page/about-us" className="hover:text-white transition-colors">Contact Us</a>
            </div>
         </div>
      </footer>
    </div>
  )
}
