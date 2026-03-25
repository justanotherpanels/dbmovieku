import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import LoginClient from '@/components/auth/LoginClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Login`,
    description: "Access your account to start streaming and downloading your favorite videos.",
  }
}

export default function Login() {
  return <LoginClient />
}
