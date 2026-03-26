import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import PolicyClient from '@/components/pages/PolicyClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Policy & Terms`,
    description: "Our Terms of Service and user compliance policy for using our video streaming and API services.",
  }
}

export default async function Policy() {
  const { data } = await supabase.from('setting_site').select('name').limit(1).single()
  const siteName = data?.name || 'MovieDB'

  return <PolicyClient siteName={siteName} />
}
