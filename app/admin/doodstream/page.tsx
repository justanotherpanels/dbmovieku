'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast, Toaster } from 'sonner'
import { 
  Video, 
  Search, 
  ExternalLink, 
  Trash2, 
  RefreshCcw, 
  Loader2,
  Copy,
  Plus,
  Pencil,
  Eye,
  FolderSync
} from 'lucide-react'

interface Server2Data {
  id: string
  folder_name?: string
  title: string
  file_code: string
  file_download_url: string
  view_count: number
  file_uploaded: string
  file_size?: number
}

export default function DoodstreamManagement() {
  const [files, setFiles] = useState<Server2Data[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('server_2')
      .select('*')
      .order('create_at', { ascending: false })

    if (error) {
      toast.error('Gagal mengambil data: ' + error.message)
    } else {
      setFiles(data || [])
    }
    setLoading(false)
  }

  const handleSync = async () => {
      setSyncing(true)
      toast.info('Sinkronisasi Doodstream dimulai...')
      
      try {
          const res = await fetch('/api/sync/doodstream', { method: 'POST' })
          const result = await res.json()
          
          if (!res.ok) throw new Error(result.error || 'Gagal sinkronisasi')
          
          toast.success(`Sinkronisasi berhasil! ${result.stats.total_files} file & ${result.stats.total_folders} folder diproses.`)
          fetchFiles() 
      } catch (error: any) {
          toast.error(error.message)
      } finally {
          setSyncing(false)
      }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Yakin ingin menghapus ${title}?`)) return
    
    try {
      const { error } = await supabase
        .from('server_2')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Data berhasil dihapus')
      setFiles(files.filter(f => f.id !== id))
    } catch (error: any) {
      toast.error('Gagal menghapus: ' + error.message)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Link disalin')
  }

  const filtered = files.filter(file => 
    file.title?.toLowerCase().includes(search.toLowerCase()) ||
    file.file_code?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Toaster richColors position="top-right" />
      
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-400">
            <Video className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-1">Doodstream Manager</h1>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative group max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-orange-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Cari file code atau judul..."
              className="block w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none text-zinc-200 placeholder-zinc-600 transition-all shadow-inner text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button 
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 whitespace-nowrap text-sm"
          >
            {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
            Sync
          </button>

          <Link 
            href="/admin/doodstream/create"
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-orange-600/20 active:scale-95 whitespace-nowrap text-sm"
          >
            <Plus className="w-5 h-5" />
            Tambah Data
          </Link>
        </div>
      </div>

      {/* Datatable */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400 uppercase text-xs font-black tracking-widest">
                <th className="px-6 py-5">Judul & Folder</th>
                <th className="px-6 py-5">File Code</th>
                <th className="px-6 py-5 text-center">Views</th>
                <th className="px-6 py-5">Link Direct</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-sm">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-zinc-800 rounded w-full"></div></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-medium italic">
                    Belum ada data Doodstream ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((file) => (
                  <tr key={file.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl group-hover:scale-110 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all duration-300">
                           <Video className="w-5 h-5 text-zinc-500 group-hover:text-orange-400" />
                        </div>
                        <div className="flex flex-col max-w-[300px]">
                          <span className="text-white font-bold truncate tracking-tight">{file.title}</span>
                          <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1.5 uppercase mt-1">
                             <FolderSync className="w-3 h-3 text-orange-500/50" /> {file.folder_name || 'No Folder'} 
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="bg-zinc-800/50 px-3 py-1 rounded-full text-orange-400 font-mono text-xs border border-zinc-800">
                         {file.file_code}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <div className="flex flex-col items-center">
                          <span className="text-white font-black text-lg">{file.view_count.toLocaleString('id-ID')}</span>
                          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">Total Views</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2 max-w-[200px]">
                          <button 
                            onClick={() => copyToClipboard(file.file_download_url)}
                            className="bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 text-[10px] font-mono text-zinc-500 hover:text-orange-400 hover:border-orange-500/50 transition-all flex items-center gap-2 group/btn truncate"
                          >
                             <Copy className="w-3.5 h-3.5 shrink-0" /> {file.file_download_url}
                          </button>
                          <a 
                            href={file.file_download_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-zinc-600 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <Link 
                           href={`/admin/doodstream/edit/${file.id}`}
                           className="p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-600 rounded-xl hover:text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/20 transition-all duration-300"
                         >
                           <Pencil className="w-5 h-5" />
                         </Link>
                         <button 
                            onClick={() => handleDelete(file.id, file.title)}
                            className="p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-600 rounded-xl hover:text-rose-400 hover:bg-rose-400/10 hover:border-rose-400/20 transition-all duration-300"
                         >
                            <Trash2 className="w-5 h-5" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
