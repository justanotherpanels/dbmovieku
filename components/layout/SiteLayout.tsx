'use client'

import { usePathname } from 'next/navigation'
import LandingNavbar from '@/components/LandingNavbar'
import LandingFooter from '@/components/LandingFooter'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Sembunyikan Landing Navbar/Footer di dashboard admin, member, atau halaman auth
  const isDashboard = pathname.startsWith('/admin') || pathname.startsWith('/member')
  const isAuth = pathname.startsWith('/auth')

  const showLandingLayout = !isDashboard && !isAuth

  return (
    <>
      {showLandingLayout && <LandingNavbar />}
      <main className={`flex-1 ${showLandingLayout ? 'pt-0' : ''}`}>
        {children}
      </main>
      {showLandingLayout && <LandingFooter />}
    </>
  )
}
