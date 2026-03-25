import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Policy & Terms`,
    description: "Our Terms of Service and user compliance policy for using our video streaming and API services.",
  }
}

export default async function Policy() {
  const { data } = await supabase.from('setting_site').select('name').limit(1).single()
  const siteName = data?.name || 'MovieDB'

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-6">
           <span className="text-sm font-black text-indigo-500 uppercase tracking-[0.3em]">Legal & Compliance</span>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">Terms of Service</h1>
           <p className="text-zinc-500 text-sm max-w-xl font-medium">Syarat dan Ketentuan Penggunaan Layanan {siteName}.</p>
        </div>

        {/* Content */}
        <div className="space-y-16 py-12 border-t border-zinc-900">
           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">1. Penggunaan Layanan</h2>
              <p className="text-zinc-500 text-sm leading-8 font-medium">
                Setiap pengguna yang mengakses layanan kami sepakat untuk tidak menggunakan {siteName} untuk aktivitas ilegal yang melanggar hukum di wilayah hukum masing-masing. Penyalahgunaan akses API dapat mengakibatkan pemblokiran akun secara permanen tanpa pemberitahuan terlebih dahulu.
              </p>
           </div>

           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">2. Hak Kekayaan Intelektual</h2>
              <p className="text-zinc-500 text-sm leading-8 font-medium">
                Kami sangat menghormati hak kekayaan intelektual. Seluruh konten yang diunggah ke server kami berada di bawah tanggung jawab pengunggah masing-masing. Kami akan menindaklanjuti setiap laporan DMCA dengan prosedur penghapusan konten yang valid sesuai aturan yang berlaku.
              </p>
           </div>

           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">3. Batasan Tanggung Jawab</h2>
              <p className="text-zinc-500 text-sm leading-8 font-medium">
                {siteName} tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul akibat gangguan server atau kehilangan data yang disebabkan oleh pihak ketiga di luar kendali teknis tim infrastruktur kami.
              </p>
           </div>
        </div>

        {/* Action Call */}
        <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-[32px] text-center space-y-4">
           <p className="text-zinc-500 text-sm font-bold">Butuh Bantuan Lebih Lanjut?</p>
           <button className="h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-indigo-600/20">
              Hubungi Tim Legal
           </button>
        </div>
      </div>
    </div>
  )
}
