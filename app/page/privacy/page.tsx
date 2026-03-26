import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import PrivacyClient from '@/components/pages/PrivacyClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Privacy Policy`,
    description: "Your safety and privacy are our top priorities. Learn how we handle your data with high encryption.",
  }
}

export default async function Privacy() {
  const { data } = await supabase.from('setting_site').select('name').limit(1).single()
  const siteName = data?.name || 'MovieDB'

  return <PrivacyClient siteName={siteName} />
}
