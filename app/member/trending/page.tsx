'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  Play, 
  PlayCircle, 
  HardDrive, 
  Clock, 
  Zap, 
  Film,
  Copy,
  TrendingUp,
  Eye
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface Movie {
  id: string
  file_name: string
  file_size: number
  file_link: string
  file_created_at: string
  view_count: number
  thumbnail?: string
  server_type: 'Streamtape' | 'Doodstream'
}

export default function TrendingPage() {
  const { t } = useLanguage()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrending()
  }, [])

  const fetchTrending = async () => {
    setLoading(true)
    
    // Fetch dari Server 1
    const { data: s1, error: e1 } = await supabase
      .from('server_1')
      .select('*')
    
    // Fetch dari Server 2
    const { data: s2, error: e2 } = await supabase
      .from('server_2')
      .select('*')
      .not('file_download_url', 'is', null)

    if (e1 || e2) {
      toast.error('Gagal mengambil data trending dari server')
    }

    // Mapping agar seragam
    const combined: Movie[] = [
      ...(s1 || []).map(item => ({
        id: item.id,
        file_name: item.file_name,
        file_size: item.file_size || 0,
        file_link: item.file_link,
        file_created_at: item.file_created_at || item.create_at,
        view_count: item.view_count || 0,
        server_type: 'Streamtape' as const
      })),
      ...(s2 || []).map(item => ({
        id: item.id,
        file_name: item.title,
        file_size: item.file_length || 0,
        file_link: item.file_download_url,
        file_created_at: item.file_uploaded || item.create_at,
        view_count: item.view_count || 0,
        thumbnail: item.file_single_img,
        server_type: 'Doodstream' as const
      }))
    ]

    // Sort by view_count descending
    combined.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))

    // Limit to TOP 20 (Grid 5x4)
    setMovies(combined.slice(0, 20))
    setLoading(false)
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast.success(t('copy_success'))
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-rose-500 fill-current" /> {t('trending_tag')}
           </h1>
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] pl-1">{t('trending_subtitle')}</p>
        </div>
      </div>

      {/* Grid Trending - 5 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {loading ? (
            Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl h-80 animate-pulse"></div>
            ))
        ) : movies.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-4 bg-zinc-900/40 border border-zinc-800 rounded-3xl">
                <Film className="w-16 h-16 text-zinc-700 mx-auto" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{t('no_trending')}</p>
            </div>
        ) : (
          movies.map((movie, index) => (
            <div key={movie.id} className="group relative bg-zinc-900 rounded-[32px] border border-zinc-800 overflow-hidden shadow-2xl hover:border-rose-500/50 transition-all duration-500 hover:-translate-y-2">
               
               {/* Rank Indicator */}
               <div className="absolute top-4 left-4 z-20 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-black italic scale-110 shadow-lg shadow-rose-600/50 border border-rose-400">
                  {index + 1}
               </div>

               <div className="aspect-[3/4] bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
                  {movie.thumbnail ? (
                    <img src={movie.thumbnail} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={movie.file_name} />
                  ) : (
                    <PlayCircle className="w-16 h-16 text-zinc-900 group-hover:text-rose-500/50 transition-all duration-500 z-10 scale-100 group-hover:scale-125" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  
                  {/* Badge Quality */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    <div className="bg-rose-600/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-rose-400/20 text-[8px] font-black uppercase tracking-widest text-white">
                       HD 1080p
                    </div>
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <a 
                      href={movie.file_link} 
                      target="_blank" 
                      className="bg-rose-600 p-5 rounded-full shadow-2xl shadow-rose-600/50 hover:scale-110 active:scale-95 transition-all"
                    >
                      <Play className="w-8 h-8 text-white fill-current" />
                    </a>
                  </div>
               </div>

               {/* Meta Details */}
               <div className="p-5 space-y-4">
                  <h3 className="text-sm font-black text-white leading-tight line-clamp-2 h-10 uppercase tracking-tight group-hover:text-rose-400 transition-colors">
                    {movie.file_name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-t border-zinc-800/60 pt-4">
                     <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-rose-500/50" /> {movie.view_count?.toLocaleString() || 0}</span>
                     <span className="flex items-center gap-1.5 text-emerald-500/60 font-black tracking-tighter">POPULAR</span>
                  </div>
 
                  <div className="flex gap-2">
                    <a 
                      href={movie.file_link} 
                      target="_blank" 
                      className="flex-1 h-10 flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all active:scale-95 group/btn"
                    >
                       <PlayCircle className="w-4 h-4 text-zinc-600 group-hover/btn:text-white" /> 
                       <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 group-hover/btn:text-white">{t('stream')}</span>
                    </a>
                    <button 
                      onClick={() => handleCopyLink(movie.file_link)}
                      className="flex-1 h-10 flex items-center justify-center gap-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-600/20"
                    >
                       <Copy className="w-4 h-4 text-white" /> 
                       <span className="text-[10px] font-black uppercase tracking-wider text-white">{t('copy')}</span>
                    </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
