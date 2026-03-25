'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Save, 
  Video, 
  Pencil, 
  Folder, 
  FileText, 
  Link as LinkIcon, 
  HardDrive, 
  Download, 
  Calendar, 
  Hash, 
  RefreshCcw,
  Zap
} from 'lucide-react'

export default function EditStreamtapeFile() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id_folder: '',
    id_name_folder: '',
    file_name: '',
    file_size: '0',
    file_link: '',
    file_created_at: '',
    file_download: '0',
    file_linkid: '',
    file_convert: ''
  })

  useEffect(() => {
    if (id) fetchFile()
  }, [id])

  const fetchFile = async () => {
    try {
      const { data, error } = await supabase
        .from('server_1')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setFormData({
          id_folder: data.id_folder || '',
          id_name_folder: data.id_name_folder || '',
          file_name: data.file_name,
          file_size: data.file_size.toString(),
          file_link: data.file_link,
          file_created_at: new Date(data.file_created_at).toISOString().split('T')[0],
          file_download: data.file_download.toString(),
          file_linkid: data.file_linkid || '',
          file_convert: data.file_convert || ''
        })
      }
    } catch (error: any) {
      toast.error('Gagal memuat data file')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('server_1')
        .update({
          id_folder: formData.id_folder || null,
          id_name_folder: formData.id_name_folder || null,
          file_name: formData.file_name,
          file_size: parseInt(formData.file_size),
          file_link: formData.file_link,
          file_created_at: new Date(formData.file_created_at).toISOString(),
          file_download: parseInt(formData.file_download),
          file_linkid: formData.file_linkid || null,
          file_convert: formData.file_convert || null,
          update_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      toast.success('File berhasil diperbarui!')
      setTimeout(() => router.push('/admin/streamtape'), 1500)
    } catch (error: any) {
      toast.error('Gagal memperbarui: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-10 text-center animate-pulse text-zinc-500">Memuat data file...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/streamtape" className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-400" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/30">
            <Pencil className="text-amber-500 w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Edit Data Streamtape</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden max-w-none w-full">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-600"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Kolom 1: Folder & IDs */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-2 px-1">
                <Folder className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-zinc-200 uppercase tracking-widest">Struktur Folder</h3>
             </div>
             
             <div className="space-y-4 bg-zinc-950/50 p-6 rounded-3xl border border-zinc-800/80 shadow-inner">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase ml-1">ID Folder</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-900 border border-zinc-700/50 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 outline-none text-zinc-200 transition-all font-mono text-xs"
                    value={formData.id_folder}
                    onChange={(e) => setFormData({...formData, id_folder: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Nama Folder</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-900 border border-zinc-700/50 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 outline-none text-zinc-200 transition-all placeholder-zinc-700"
                    value={formData.id_name_folder}
                    onChange={(e) => setFormData({...formData, id_name_folder: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Link ID File</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-900 border border-zinc-700/50 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 outline-none text-zinc-200 transition-all font-mono text-xs placeholder-zinc-700"
                    value={formData.file_linkid}
                    onChange={(e) => setFormData({...formData, file_linkid: e.target.value})}
                  />
                </div>
             </div>
          </div>

          {/* Kolom 2: File Details */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-2 px-1">
                <FileText className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-zinc-200 uppercase tracking-widest">Informasi File</h3>
             </div>

             <div className="space-y-4 bg-zinc-950/50 p-6 rounded-3xl border border-zinc-800/80 shadow-inner">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Nama File</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-zinc-900 border border-zinc-700/50 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-amber-500/50 outline-none text-zinc-200 transition-all"
                    value={formData.file_name}
                    onChange={(e) => setFormData({...formData, file_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Link Streamtape</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                      <LinkIcon className="h-4 w-4" />
                    </div>
                    <input
                      type="url"
                      required
                      className="w-full bg-zinc-900 border border-zinc-700/50 rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-amber-500/50 outline-none text-zinc-200 transition-all"
                      value={formData.file_link}
                      onChange={(e) => setFormData({...formData, file_link: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Ukuran (Bytes)</label>
                  <div className="relative text-zinc-600">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HardDrive className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      required
                      className="w-full bg-zinc-900 border border-zinc-700/50 rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-amber-500/50 outline-none text-zinc-200 transition-all"
                      value={formData.file_size}
                      onChange={(e) => setFormData({...formData, file_size: e.target.value})}
                    />
                  </div>
                </div>
             </div>
          </div>

          {/* Kolom 3: Stats & Conversion */}
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-2 px-1">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-zinc-200 uppercase tracking-widest">Statistik & Meta</h3>
             </div>

             <div className="space-y-4 bg-zinc-950/50 p-6 rounded-3xl border border-zinc-800/80 shadow-inner">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Total Download</label>
                  <div className="relative text-zinc-600">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Download className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      className="w-full bg-zinc-900 border border-zinc-700/50 rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-amber-500/50 outline-none text-zinc-200 transition-all"
                      value={formData.file_download}
                      onChange={(e) => setFormData({...formData, file_download: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Tanggal Pembuatan</label>
                  <div className="relative text-zinc-600">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <input
                      type="date"
                      className="w-full bg-zinc-900 border border-zinc-700/50 rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-amber-500/50 outline-none text-zinc-200 transition-all cursor-pointer"
                      value={formData.file_created_at}
                      onChange={(e) => setFormData({...formData, file_created_at: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Link Hasil Convert</label>
                  <div className="relative text-zinc-600">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <RefreshCcw className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      className="w-full bg-zinc-900 border border-zinc-700/50 rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-amber-500/50 outline-none text-zinc-200 transition-all font-mono text-xs placeholder-zinc-700"
                      value={formData.file_convert}
                      onChange={(e) => setFormData({...formData, file_convert: e.target.value})}
                    />
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-end border-t border-zinc-800 pt-8">
           <Link href="/admin/streamtape" className="px-8 py-3 text-zinc-500 hover:text-white font-bold transition-all mr-4">
             Batal
           </Link>
           <button
            type="submit"
            disabled={submitting}
            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-black px-12 py-4 rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-amber-600/20 active:scale-95 uppercase tracking-tighter"
          >
            {submitting ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <Save className="w-5 h-5 shrink-0" />}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  )
}
