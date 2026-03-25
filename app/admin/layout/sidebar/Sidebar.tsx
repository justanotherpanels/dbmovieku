'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard,
  PlaySquare,
  Users,
  Settings,
  LogOut,
  Video,
  Webhook,
  Activity,
  Heart
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const [siteData, setSiteData] = useState({ name: 'Admin Panel', logo: '' })

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const { data, error } = await supabase
          .from('setting_site')
          .select('name, logo')
          .limit(1)
          .single()
        
        if (data) {
          setSiteData({
            name: data.name || 'Admin Panel',
            logo: data.logo || ''
          })
        }
      } catch (err) {
        console.error('Error fetching site data for sidebar:', err)
      }
    }
    fetchSiteData()
  }, [])

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Streamtape', href: '/admin/streamtape', icon: PlaySquare },
    { name: 'Doodstream', href: '/admin/doodstream', icon: Video },
    { name: 'Manajemen User', href: '/admin/user', icon: Users },
    { name: 'Konfigurasi API', href: '/admin/api-config', icon: Webhook },
    { name: 'Donasi', href: '/admin/donation', icon: Heart },
    { name: 'Pengaturan Situs', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen flex flex-col p-4 shadow-2xl relative z-20">
      <div className="flex items-center justify-center mb-10 mt-4 px-2">
        {siteData.logo ? (
          <Link href="/admin" className="block w-full">
            <img 
              src={siteData.logo} 
              alt="Logo" 
              className="w-full h-auto object-contain max-h-16"
            />
          </Link>
        ) : (
          <div className="bg-indigo-600 p-2.5 rounded-xl">
            <Video className="text-white w-5 h-5" />
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1.5 px-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                  ? 'bg-indigo-600/10 text-indigo-400 font-bold border border-indigo-600/10 shadow-inner'
                  : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'group-hover:text-zinc-200'}`} />
              <span className="text-sm font-bold tracking-tight">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-zinc-800/50 pt-4 mt-auto mb-2 px-1">
        <Link
          href="/auth/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-600 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
        </Link>
      </div>
    </div>
  )
}
