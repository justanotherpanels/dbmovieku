import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import LandingClient from '@/components/LandingClient'

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase.from('setting_site').select('name').limit(1).single()
  const siteName = data?.name || 'MovieDB'
  
  return {
    title: {
      absolute: `${siteName} - No. 1 Streaming & Download Hub`,
    },
    description: "Experience the best video streaming and fast downloads. Access our powerful REST API for developers. Stream everything, download anywhere.",
    openGraph: {
      title: `${siteName} - Stream & Download`,
      description: "Unlimited video streaming and high-speed downloads with free developer API.",
    },
  }
}

export default function Home() {
  return <LandingClient />
}
