'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Save, 
  Edit3, 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Activity,
  Key
} from 'lucide-react'

export default function EditUser() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // Biarkan kosong jika tidak diubah
    level: 'Member',
    status: 'Active',
    apikey: ''
  })

  useEffect(() => {
    if (id) fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) {
        setFormData({
          name: data.name,
          email: data.email,
          password: '',
          level: data.level,
          status: data.status,
          apikey: data.apikey || ''
        })
      }
    } catch (error: any) {
      toast.error('Gagal memuat data user')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const updates: any = {
        name: formData.name,
        email: formData.email,
        level: formData.level,
        status: formData.status,
        apikey: formData.apikey,
        update_at: new Date().toISOString()
      }

      if (formData.password.trim() !== '') {
        updates.password = await bcrypt.hash(formData.password, 10)
      }

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      toast.success('User ' + formData.name + ' berhasil diperbarui!')
      setTimeout(() => router.push('/admin/user'), 1500)
    } catch (error: any) {
      toast.error('Gagal memperbarui user: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-10 text-center animate-pulse text-zinc-500">Memuat data user...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/user" className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-zinc-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 p-2 rounded-xl">
              <Edit3 className="text-amber-500 w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Edit Profile User</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section: Akun */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-zinc-300 flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-indigo-400" /> Informasi Dasar
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">Nama Lengkap</label>
              <input
                type="text"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-zinc-700 text-zinc-200"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-600 group-focus-within:text-indigo-400" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-zinc-700 text-zinc-200"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-600 group-focus-within:text-indigo-400" />
                </div>
                <input
                  type="password"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-zinc-700 text-zinc-200"
                  placeholder="Isi hanya jika ingin mengubah password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <p className="text-[10px] text-zinc-600 italic ml-1">*Biarkan kosong jika tidak ingin mengganti password lama.</p>
            </div>
          </div>

          {/* Section: Konfigurasi */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-zinc-300 flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-indigo-400" /> Pengaturan Akses
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-400 ml-1">Level</label>
                <select
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-zinc-200 cursor-pointer appearance-none"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-400 ml-1">Status</label>
                <select
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-zinc-200 cursor-pointer appearance-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Not-Active">Not-Active</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-zinc-800">
              <label className="text-sm font-semibold text-zinc-400 ml-1 flex items-center gap-2">
                <Key className="w-4 h-4 text-zinc-500" /> API Key
              </label>
              <input
                type="text"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-zinc-700 text-zinc-200 font-mono text-sm"
                value={formData.apikey}
                onChange={(e) => setFormData({...formData, apikey: e.target.value})}
              />
            </div>
            
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-[11px] text-zinc-500 flex items-center gap-2 animate-pulse">
                <Activity className="w-3 h-3 text-indigo-500" /> Modifikasi data akan langsung berpengaruh pada akses user tersebut.
            </div>
          </div>
        </div>

        {/* Footer: Actions */}
        <div className="mt-12 flex items-center justify-end gap-4 border-t border-zinc-800 pt-8">
          <Link
            href="/admin/user"
            className="px-6 py-3 text-zinc-400 hover:text-white font-bold transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-amber-600/20 active:scale-95"
          >
            {submitting ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Update User
          </button>
        </div>
      </form>
    </div>
  )
}
