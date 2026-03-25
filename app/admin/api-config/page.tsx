'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  Webhook, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Database,
  Calendar,
  AlertTriangle,
  X,
  Code
} from 'lucide-react'

interface ApiServerData {
  id: string
  type: 'Streamtape' | 'Doodstream'
  api_config: any
  create_at: string
}

export default function ApiConfigPage() {
  const [servers, setServers] = useState<ApiServerData[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [serverToDelete, setServerToDelete] = useState<ApiServerData | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchServers()
  }, [])

  const fetchServers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('api_server')
      .select('*')
      .order('create_at', { ascending: false })

    if (error) {
      toast.error('Gagal mengambil data API Server: ' + error.message)
    } else {
      setServers(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!serverToDelete) return
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('api_server')
        .delete()
        .eq('id', serverToDelete.id)

      if (error) throw error

      toast.success(`Konfigurasi ${serverToDelete.type} berhasil dihapus`)
      setServers(servers.filter(s => s.id !== serverToDelete.id))
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error('Gagal menghapus server: ' + error.message)
    } finally {
      setDeleting(false)
      setServerToDelete(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/20 p-3 rounded-2xl">
            <Webhook className="text-indigo-400 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Konfigurasi API Server</h1>
            <p className="text-zinc-500 text-sm font-medium">Kelola API Key Streamtape dan Doodstream</p>
          </div>
        </div>

        <Link 
            href="/admin/api-config/create"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
        >
            <Plus className="w-5 h-5" />
            Tambah Server
        </Link>
      </div>

      {/* Datatable */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">Tipe Server</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">API Config (JSON)</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">Terdaftar</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8"><div className="h-4 bg-zinc-800 rounded w-full"></div></td>
                  </tr>
                ))
              ) : servers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 font-medium italic">
                    Belum ada server yang dikonfigurasi.
                  </td>
                </tr>
              ) : (
                servers.map((server) => (
                  <tr key={server.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                          server.type === 'Streamtape' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                        }`}>
                          <Database className="w-5 h-5" />
                        </div>
                        <span className="text-white font-bold">{server.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                          <Code className="w-4 h-4 text-zinc-600" />
                          <span className="text-zinc-500 text-xs font-mono truncate max-w-[300px]">
                            {JSON.stringify(server.api_config)}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-600" />
                        {formatDate(server.create_at)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 text-zinc-300">
                        <Link 
                          href={`/admin/api-config/edit/${server.id}`}
                          className="p-2 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-all duration-200"
                        >
                          <Pencil className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => { setServerToDelete(server); setIsModalOpen(true); }}
                          className="p-2 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all duration-200"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 min-h-screen">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => !deleting && setIsModalOpen(false)}></div>
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
             <div className="p-8 text-center">
                <div className="mx-auto bg-red-500/20 p-3 rounded-2xl w-fit mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-2">Hapus Konfigurasi?</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Apakah Anda yakin ingin menghapus server <span className="text-white font-bold">{serverToDelete?.type}</span>? Tindakan ini permanen.
                </p>
                <div className="mt-10 flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-2xl text-zinc-400 font-bold hover:bg-zinc-800 transition-all border border-zinc-800">
                    Batal
                  </button>
                  <button onClick={handleDelete} disabled={deleting} className="flex-1 px-6 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
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
