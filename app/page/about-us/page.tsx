import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase.from('setting_site').select('name, favicon').limit(1).single()
  return {
    title: `About Us | ${data?.name || 'MovieDB'}`,
    icons: {
      icon: data?.favicon || '/favicon.ico',
    }
  }
}

export default async function AboutUs() {
  const { data } = await supabase.from('setting_site').select('name').limit(1).single()
  const siteName = data?.name || 'MovieDB'

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-6 text-center md:text-left">
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">About Us</h1>
           <div className="w-20 h-2 bg-indigo-600 rounded-full"></div>
           <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
             Kami adalah platform hiburan digital yang berfokus pada kemudahan akses konten video berkualitas tinggi dan penyampaian infrastruktur REST API yang kuat bagi para pengembang.
           </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[32px] space-y-4">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Visi Kami</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                Menjadi jembatan antara konten hiburan global dengan audiens di seluruh penjuru dunia melalui teknologi distribusi video yang efisien, cepat, dan aman.
              </p>
           </div>
           <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[32px] space-y-4">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Teknologi API</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                Penyediaan dokumentasi API yang stabil memungkinkan mitra pengembang kami untuk berinovasi tanpa harus mengkhawatirkan infrastruktur backend yang rumit.
              </p>
           </div>
        </div>

        {/* Story Content */}
        <div className="prose prose-invert prose-zinc max-w-none border-t border-zinc-900 pt-12">
           <p className="text-zinc-500 leading-8">
             Berawal dari semangat untuk menciptakan ekosistem distribusi video yang lebih transparan dan mudah diakses, {siteName} bertransformasi dari sebuah proyek kecil menjadi pusat sumber daya media digital yang dipercayai oleh ribuan pengguna setiap harinya. Kami percaya bahwa teknologi harus melayani manusia dengan cara yang paling sederhana dan seefektif mungkin.
           </p>
        </div>
      </div>
    </div>
  )
}
