'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Save, 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Activity,
  Key
} from 'lucide-react'

export default function CreateUser() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    level: 'Member',
    status: 'Active',
    apikey: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Hash Password
      const hashedPassword = await bcrypt.hash(formData.password, 10)

      // 2. Insert to Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: formData.name,
          email: formData.email,
          password: hashedPassword,
          level: formData.level,
          status: formData.status,
          ...(formData.apikey ? { apikey: formData.apikey } : {})
        }])
        .select()

      if (error) throw error

      toast.success('User ' + formData.name + ' berhasil dibuat!')
      setTimeout(() => router.push('/admin/user'), 1500)
    } catch (error: any) {
      toast.error('Gagal membuat user: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/user" className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-zinc-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-xl">
              <UserPlus className="text-green-500 w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Tambah User Baru</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section: Akun */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-zinc-300 flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-indigo-400" /> Informasi Dasar
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">Nama Lengkap</label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-zinc-700 text-zinc-200"
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
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
                  placeholder="budi@example.com"
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
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-zinc-700 text-zinc-200"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section: Konfigurasi */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-zinc-300 flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-indigo-400" /> Pengaturan Akses
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-400 ml-1 flex items-center gap-2">
                   Level
                </label>
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
                <label className="text-sm font-semibold text-zinc-400 ml-1 flex items-center gap-2">
                   Status
                </label>
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
                <Key className="w-4 h-4 text-zinc-500" /> Custom API Key (Opsional)
              </label>
              <input
                type="text"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-zinc-700 text-zinc-200 font-mono text-sm"
                placeholder="Biarkan kosong untuk otomatis"
                value={formData.apikey}
                onChange={(e) => setFormData({...formData, apikey: e.target.value})}
              />
              <p className="text-[10px] text-zinc-600 italic">API Key akan di-generate otomatis oleh sistem jika dikosongkan.</p>
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
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Simpan User
          </button>
        </div>
      </form>
    </div>
  )
}
