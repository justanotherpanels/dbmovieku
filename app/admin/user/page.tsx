'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  Users, 
  Search, 
  Shield, 
  User, 
  Mail, 
  Key, 
  CheckCircle2, 
  XCircle,
  Calendar,
  Pencil,
  Trash2,
  UserPlus,
  AlertTriangle,
  X
} from 'lucide-react'

interface UserData {
  id: string
  name: string
  email: string
  level: 'Member' | 'Admin'
  apikey: string
  status: 'Active' | 'Not-Active'
  create_at: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // Modal Delete state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('create_at', { ascending: false })

    if (error) {
      toast.error('Gagal mengambil data user: ' + error.message)
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userToDelete.id)

      if (error) throw error

      toast.success(`User ${userToDelete.name} berhasil dihapus`)
      setUsers(users.filter(u => u.id !== userToDelete.id))
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error('Gagal menghapus user: ' + error.message)
    } finally {
      setDeleting(false)
      setUserToDelete(null)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/20 p-3 rounded-2xl">
            <Users className="text-amber-500 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Manajemen User</h1>
            <p className="text-zinc-500 text-sm font-medium">Total {users.length} pengguna terdaftar</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative group max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau email..."
              className="block w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none text-zinc-200 placeholder-zinc-600 transition-all shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Link 
            href="/admin/user/edit/create"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
          >
            <UserPlus className="w-5 h-5" />
            Tambah User
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">Identitas Pengguna</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-center">Level</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">API Key</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">Terdaftar</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8"><div className="h-4 bg-zinc-800 rounded w-full"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 font-medium italic">
                    Tidak ada data user ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                          <User className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{user.name}</span>
                          <span className="text-zinc-500 text-xs font-medium flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        user.level === 'Admin' 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                      }`}>
                        {user.level === 'Admin' && <Shield className="w-3 h-3" />}
                        {user.level}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 max-w-[150px]">
                        <Key className="w-4 h-4 text-zinc-600 shrink-0" />
                        <span className="text-zinc-500 text-xs font-mono truncate select-all">{user.apikey}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        user.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-zinc-800/50 text-zinc-500 border border-zinc-800/50'
                      }`}>
                        {user.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-600" />
                        {formatDate(user.create_at)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 text-zinc-300">
                        <Link 
                          href={`/admin/user/edit/${user.id}`}
                          className="p-2 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-all duration-200"
                          title="Edit User"
                        >
                          <Pencil className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => { setUserToDelete(user); setIsModalOpen(true); }}
                          className="p-2 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all duration-200"
                          title="Hapus User"
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

      {/* Modern Modal Deletion */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 min-h-screen">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => !deleting && setIsModalOpen(false)}
          ></div>
          
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-red-500/20 p-3 rounded-2xl">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-zinc-500 hover:text-white rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Hapus Pengguna?</h3>
              <p className="text-zinc-400 leading-relaxed">
                Anda yakin ingin menghapus user <span className="text-white font-bold">{userToDelete?.name}</span>? Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="mt-10 flex gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl text-zinc-400 font-bold hover:bg-zinc-800 transition-all border border-zinc-800"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="flex-1 px-6 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                     <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  ) : 'Hapus Sekarang'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
