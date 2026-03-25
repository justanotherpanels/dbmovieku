import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import RegisterClient from '@/components/auth/RegisterClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Register`,
    description: "Create an account to start your premium video streaming experience and get instant API access.",
  }
}

export default function Register() {
  return <RegisterClient />
}
