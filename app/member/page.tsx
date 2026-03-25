'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useLanguage } from '@/context/LanguageContext'
import { 
  Play, 
  PlayCircle, 
  HardDrive, 
  Clock, 
  Search, 
  Zap, 
  Film,
  Copy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface Movie {
  id: string
  file_name: string
  file_size: number
  file_link: string
  file_created_at: string
  thumbnail?: string
  server_type: 'Streamtape' | 'Doodstream'
}

export default function MemberHome() {
  const { t } = useLanguage()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15 // 5x3 Grid

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    setLoading(true)
    
    const { data: s1, error: e1 } = await supabase
      .from('server_1')
      .select('*')
    
    const { data: s2, error: e2 } = await supabase
      .from('server_2')
      .select('*')
      .not('file_download_url', 'is', null)

    if (e1 || e2) {
      toast.error('Gagal mengambil data dari beberapa server')
    }

    const combined: Movie[] = [
      ...(s1 || []).map(item => ({
        id: item.id,
        file_name: item.file_name,
        file_size: item.file_size || 0,
        file_link: item.file_link,
        file_created_at: item.file_created_at || item.create_at,
        server_type: 'Streamtape' as const
      })),
      ...(s2 || []).map(item => ({
        id: item.id,
        file_name: item.title,
        file_size: item.file_length || 0,
        file_link: item.file_download_url,
        file_created_at: item.file_uploaded || item.create_at,
        thumbnail: item.file_single_img,
        server_type: 'Doodstream' as const
      }))
    ]

    combined.sort((a, b) => new Date(b.file_created_at).getTime() - new Date(a.file_created_at).getTime())

    setMovies(combined)
    setLoading(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredMovies = movies.filter(m => 
    m.file_name?.toLowerCase().includes(search.toLowerCase())
  )

  // Pagination Logic
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
              <Zap className="w-8 h-8 text-indigo-500 fill-current" /> {t('list_video')}
           </h1>
        </div>

        <div className="relative group max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder={t('search_placeholder')}
              className="block w-full pl-11 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-zinc-200 placeholder-zinc-700 transition-all shadow-inner font-medium text-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1) // Reset ke hal 1 saat cari
              }}
            />
        </div>
      </div>

      {/* Grid List - 5 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {loading ? (
          Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl h-80 animate-pulse relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
          ))
        ) : paginatedMovies.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4 bg-zinc-900/40 border border-zinc-800 rounded-3xl">
              <Film className="w-16 h-16 text-zinc-700 mx-auto" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Belum ada video ditemukan.</p>
          </div>
        ) : (
          paginatedMovies.map((movie) => (
            <div key={movie.id} className="group relative bg-zinc-900 rounded-[32px] border border-zinc-800 overflow-hidden shadow-2xl hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2">
               {/* Thumbnail Image */}
               <div className="aspect-[3/4] bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
                  {movie.thumbnail ? (
                    <img src={movie.thumbnail} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={movie.file_name} />
                  ) : (
                    <PlayCircle className="w-16 h-16 text-zinc-800 group-hover:text-indigo-500/50 transition-all duration-500 z-10 scale-100 group-hover:scale-125" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  
                  {/* Badge Quality */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    <div className="bg-indigo-600/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-indigo-400/20 text-[8px] font-black uppercase tracking-widest text-white">
                      HD 1080p
                    </div>
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <a 
                      href={movie.file_link} 
                      target="_blank" 
                      className="bg-indigo-600 p-5 rounded-full shadow-2xl shadow-indigo-600/50 hover:scale-110 active:scale-95 transition-all"
                    >
                      <Play className="w-8 h-8 text-white fill-current" />
                    </a>
                  </div>
               </div>

               {/* Meta Details */}
               <div className="p-5 space-y-4">
                  <h3 className="text-sm font-black text-white leading-tight line-clamp-2 h-10 uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                    {movie.file_name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-t border-zinc-800/60 pt-4">
                     <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-indigo-500/50" /> {formatFileSize(movie.file_size)}</span>
                     <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-500/50" /> {new Date(movie.file_created_at).toLocaleDateString('id-ID')}</span>
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
                      onClick={() => {
                        navigator.clipboard.writeText(movie.file_link)
                        toast.success(t('copy_success'))
                      }}
                      className="flex-1 h-10 flex items-center justify-center gap-2 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
           <button 
             onClick={() => handlePageChange(currentPage - 1)}
             disabled={currentPage === 1}
             className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white hover:border-indigo-500 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl"
           >
              <ChevronLeft className="w-6 h-6" />
           </button>

           <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1
                // Show only limited page numbers if too many
                if (totalPages > 5) {
                   if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                      if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="text-zinc-600 px-1">...</span>
                      return null
                   }
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xs transition-all border ${
                      currentPage === pageNum 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30 grow' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
           </div>

           <button 
             onClick={() => handlePageChange(currentPage + 1)}
             disabled={currentPage === totalPages}
             className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white hover:border-indigo-500 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl"
           >
              <ChevronRight className="w-6 h-6" />
           </button>
        </div>
      )}
    </div>
  )
}
