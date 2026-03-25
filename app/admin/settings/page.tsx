'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  Save, 
  Globe, 
  ImageIcon, 
  Loader2,
  Upload,
  X,
  Zap
} from 'lucide-react'

export default function SiteSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    favicon: '',
    logo: ''
  })

  // Local state for temporary upload previews
  const [logoPreview, setLogoPreview] = useState('')
  const [faviconPreview, setFaviconPreview] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('setting_site')
        .select('*')
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setFormData({
          id: data.id,
          name: data.name,
          favicon: data.favicon || '',
          logo: data.logo || ''
        })
        setLogoPreview(data.logo || '')
        setFaviconPreview(data.favicon || '')
      }
    } catch (error: any) {
      toast.error('Gagal memuat pengaturan: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === 'logo') {
          setLogoFile(file)
          setLogoPreview(reader.result as string)
        } else {
          setFaviconFile(file)
          setFaviconPreview(reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadFile = async (file: File) => {
    const body = new FormData()
    body.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body
    })
    
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Gagal mengunggah file')
    return data.url // e.g., /image/123-filename.png
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let finalLogo = formData.logo
      let finalFavicon = formData.favicon

      // 1. Upload Logo if changed
      if (logoFile) {
        toast.info('Mengunggah logo...')
        finalLogo = await uploadFile(logoFile)
      }

      // 2. Upload Favicon if changed
      if (faviconFile) {
        toast.info('Mengunggah favicon...')
        finalFavicon = await uploadFile(faviconFile)
      }

      // 3. Update Database
      let error
      if (formData.id) {
        const { error: err } = await supabase
          .from('setting_site')
          .update({
            name: formData.name,
            favicon: finalFavicon,
            logo: finalLogo,
            update_at: new Date().toISOString()
          })
          .eq('id', formData.id)
        error = err
      } else {
        const { error: err } = await supabase
          .from('setting_site')
          .insert([{
            name: formData.name,
            favicon: finalFavicon,
            logo: finalLogo
          }])
        error = err
      }

      if (error) throw error
      toast.success('Pengaturan situs berhasil disimpan!')
      setLogoFile(null)
      setFaviconFile(null)
      fetchSettings()
    } catch (error: any) {
      toast.error('Gagal menyimpan: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      <p className="font-medium text-[10px] tracking-widest uppercase">Memuat...</p>
    </div>
  )

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-7xl">
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Website Name */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <Globe className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest">Identitas</h3>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 p-5 rounded-xl space-y-4 shadow-inner min-h-[160px]">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nama Website</label>
                <input
                  type="text"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700/50 rounded-xl py-2.5 px-4 focus:ring-1 focus:ring-indigo-500/50 outline-none text-zinc-100 transition-all placeholder-zinc-800 text-sm"
                  placeholder="MyMovie Portal"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Column 2: Logo Upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest">Logo (Upload)</h3>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 p-5 rounded-xl space-y-4 shadow-inner min-h-[160px] flex flex-col justify-between">
              <input 
                type="file" 
                ref={logoInputRef}
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'logo')}
              />
              {logoPreview ? (
                 <div className="relative group/img flex justify-center p-2 bg-black/40 rounded-lg border border-zinc-800 overflow-hidden h-20 items-center">
                    <img src={logoPreview} alt="Preview" className="max-h-full object-contain opacity-70" />
                    <button 
                      type="button"
                      onClick={() => { setLogoPreview(''); setLogoFile(null); }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                 </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="w-full h-20 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 hover:text-purple-400 hover:border-purple-400/50 transition-all gap-1"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-[9px] font-bold uppercase">Upload Logo</span>
                </button>
              )}
            </div>
          </div>

          {/* Column 3: Favicon Upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <Zap className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest">Favicon (Upload)</h3>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 p-5 rounded-xl space-y-4 shadow-inner min-h-[160px] flex flex-col justify-between">
              <input 
                type="file" 
                ref={faviconInputRef}
                className="hidden" 
                accept="image/*, .ico"
                onChange={(e) => handleFileChange(e, 'favicon')}
              />
              {faviconPreview ? (
                 <div className="relative group/img flex items-center gap-3 p-4 bg-black/40 rounded-lg border border-zinc-800">
                    <img src={faviconPreview} alt="Favicon" className="w-8 h-8 object-contain" />
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">Icon Ready</span>
                    <button 
                      type="button"
                      onClick={() => { setFaviconPreview(''); setFaviconFile(null); }}
                      className="ml-auto p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                 </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => faviconInputRef.current?.click()}
                  className="w-full h-20 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 hover:text-emerald-400 hover:border-emerald-400/50 transition-all gap-1"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-[9px] font-bold uppercase">Upload Favicon</span>
                </button>
              )}
            </div>
          </div>

        </div>

        <div className="mt-8 flex items-center justify-end border-t border-zinc-800/50 pt-6">
           <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-8 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95 text-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  )
}
