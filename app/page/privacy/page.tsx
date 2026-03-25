import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase.from('setting_site').select('name, favicon').limit(1).single()
  return {
    title: `Privacy Policy | ${data?.name || 'MovieDB'}`,
    icons: {
      icon: data?.favicon || '/favicon.ico',
    }
  }
}

export default async function Privacy() {
  const { data } = await supabase.from('setting_site').select('name').limit(1).single()
  const siteName = data?.name || 'MovieDB'

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-6">
           <span className="text-sm font-black text-emerald-500 uppercase tracking-[0.3em]">Data & Safety</span>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">Privacy Policy</h1>
           <p className="text-zinc-500 text-sm max-w-xl font-medium">Informasi tentang pengumpulan dan perlindungan data pribadi Anda.</p>
        </div>

        {/* Content Section */}
        <div className="space-y-16 py-12 border-t border-zinc-900 font-sans">
           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">Pengumpulan Data</h2>
              <p className="text-zinc-500 text-sm leading-8 font-medium">
                Sesuai dengan praktik perlindungan data yang ketat, {siteName} hanya mengumpulkan alamat email dan nama pengguna untuk kepentingan autentikasi dan komunikasi transaksional esensial saja. Kami menjamin tidak ada data kredensial pihak ketiga yang tersimpan secara murni di dalam basis data kami tanpa enkripsi.
              </p>
           </div>

           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">Keamanan API Key</h2>
              <p className="text-zinc-500 text-sm leading-8 font-medium">
                Setiap API Key yang dihasilkan unik bagi setiap pengguna dan harus dijaga kerahasiaannya. {siteName} tidak berhak menggunakan Kunci API Anda untuk keperluan di luar aktivitas monitoring performa teknis sistem internal kami sendiri.
              </p>
           </div>

           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">Pihak Ketiga</h2>
              <p className="text-zinc-500 text-sm leading-8 font-medium">
                Kami tidak bekerja sama dengan pihak pengiklan luar untuk penyalahgunaan preferensi konten pengguna. Kepercayaan Anda adalah prioritas utama dalam membangun platform hiburan yang jujur dan aman.
              </p>
           </div>
        </div>

        {/* Action Call */}
        <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-[40px] flex flex-col items-center gap-6">
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center">Diperbarui Terakhir: Maret 2026</p>
           <div className="h-1.5 w-16 bg-zinc-800 rounded-full"></div>
           <p className="text-zinc-500 text-sm font-bold text-center">Silakan hubungi kami untuk informasi lebih lanjut.</p>
        </div>
      </div>
    </div>
  )
}
