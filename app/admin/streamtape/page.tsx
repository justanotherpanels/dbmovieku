'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  Video, 
  Search, 
  Database,
  Download,
  ExternalLink,
  Calendar,
  Trash2,
  AlertTriangle,
  X,
  Copy,
  FolderOpen,
  Plus,
  Pencil,
  RefreshCcw,
  Loader2
} from 'lucide-react'

interface Server1Data {
  id: string
  id_folder?: string
  id_name_folder?: string
  file_name: string
  file_size: number
  file_link: string
  file_created_at: string
  file_download: number
  file_linkid?: string
  file_convert?: string
  create_at: string
}

export default function StreamtapeManagement() {
  const [files, setFiles] = useState<Server1Data[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // Delete Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<Server1Data | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('server_1')
      .select('*')
      .order('create_at', { ascending: false })

    if (error) {
      toast.error('Gagal mengambil data file: ' + error.message)
    } else {
      setFiles(data || [])
    }
    setLoading(false)
  }

  const handleSync = async () => {
      setSyncing(true)
      toast.info('Memulai sinkronisasi Streamtape...')
      
      try {
          const res = await fetch('/api/sync/streamtape', { method: 'POST' })
          const result = await res.json()
          
          if (!res.ok) throw new Error(result.error || 'Terjadi kesalahan saat sinkronisasi')
          
          toast.success(`Sinkronisasi berhasil! ${result.stats.inserted} baru, ${result.stats.deleted} dihapus.`)
          fetchFiles() // Reload data
      } catch (error: any) {
          toast.error(error.message)
      } finally {
          setSyncing(false)
      }
  }

  const handleDelete = async () => {
    if (!fileToDelete) return
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('server_1')
        .delete()
        .eq('id', fileToDelete.id)

      if (error) throw error

      toast.success(`Berhasil menghapus file ${fileToDelete.file_name}`)
      setFiles(files.filter(f => f.id !== fileToDelete.id))
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error('Gagal menghapus file: ' + error.message)
    } finally {
      setDeleting(false)
      setFileToDelete(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Link disalin ke clipboard')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredFiles = files.filter(file => 
    file.file_name?.toLowerCase().includes(search.toLowerCase()) ||
    file.id_name_folder?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/20 p-3 rounded-2xl">
            <Video className="text-blue-400 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-1">Streamtape Manager</h1>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative group max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Cari nama file atau folder..."
              className="block w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none text-zinc-200 placeholder-zinc-600 transition-all shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button 
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg active:scale-95 whitespace-nowrap disabled:opacity-50"
          >
            {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
            Sync
          </button>

          <Link 
            href="/admin/streamtape/create"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 whitespace-nowrap"
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
                <th className="px-6 py-5">Nama File & Folder</th>
                <th className="px-6 py-5">Ukuran</th>
                <th className="px-6 py-5 text-center">Download</th>
                <th className="px-6 py-5">Link Stream</th>
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
              ) : filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-medium italic">
                    Belum ada data file ditemukan.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300">
                           <Video className="w-5 h-5 text-zinc-500 group-hover:text-blue-400" />
                        </div>
                        <div className="flex flex-col max-w-[300px]">
                          <span className="text-white font-bold truncate tracking-tight">{file.file_name}</span>
                          <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1.5 uppercase mt-1">
                             <FolderOpen className="w-3 h-3 text-amber-500/50" /> {file.id_name_folder || 'No Folder'} 
                             <span className="text-zinc-800 font-normal">|</span>
                             ID: {file.file_linkid || '-'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="bg-zinc-800/50 px-3 py-1 rounded-full text-zinc-400 font-mono text-xs border border-zinc-800">
                         {formatFileSize(file.file_size)}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <div className="flex flex-col items-center">
                          <span className="text-white font-black text-lg">{file.file_download.toLocaleString('id-ID')}</span>
                          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">Downloads</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2 max-w-[200px]">
                          <button 
                            onClick={() => copyToClipboard(file.file_link)}
                            className="bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 text-[10px] font-mono text-zinc-500 hover:text-blue-400 hover:border-blue-500/50 transition-all flex items-center gap-2 group/btn truncate"
                          >
                             <Copy className="w-3.5 h-3.5 shrink-0" /> {file.file_link}
                          </button>
                          <a 
                            href={file.file_link} 
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
                           href={`/admin/streamtape/edit/${file.id}`}
                           className="p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-600 rounded-xl hover:text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/20 transition-all duration-300"
                         >
                           <Pencil className="w-5 h-5" />
                         </Link>
                         <button 
                            onClick={() => { setFileToDelete(file); setIsModalOpen(true); }}
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

      {/* Delete Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={() => !deleting && setIsModalOpen(false)}></div>
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-600"></div>
             <div className="p-8 text-center">
                <div className="mx-auto bg-red-500/10 p-4 rounded-3xl w-fit mb-6 ring-1 ring-red-500/20">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Hapus File?</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Apakah Anda yakin ingin menghapus file <br/>
                  <span className="text-white font-extrabold uppercase text-[12px] bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-800 mt-2 block w-fit mx-auto truncate max-w-full italic">"{fileToDelete?.file_name}"</span><br/>
                  Data ini akan dihapus permanen dari sistem.
                </p>
                <div className="mt-10 flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-2xl text-zinc-500 font-bold hover:bg-zinc-800 transition-all border border-zinc-800">
                    Batal
                  </button>
                  <button onClick={handleDelete} disabled={deleting} className="flex-1 px-6 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50">
                    {deleting ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
