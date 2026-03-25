import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import DonationClient from '@/components/DonationClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Support & Donation`,
    description: "Support our project and help us keep the servers running. We accept QRIS, PayPal, and Crypto donations.",
  }
}

export default function DonationPage() {
  return <DonationClient />
}
