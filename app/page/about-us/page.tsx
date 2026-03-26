import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import AboutUsClient from '@/components/pages/AboutUsClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `About Us`,
    description: "Learn more about our mission to provide high-quality video streaming and a powerful REST API for developers.",
  }
}

export default async function AboutUs() {
  const { data } = await supabase.from('setting_site').select('name').limit(1).single()
  const siteName = data?.name || 'MovieDB'

  return <AboutUsClient siteName={siteName} />
}
