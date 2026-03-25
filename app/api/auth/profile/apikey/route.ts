import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Generate random 32 byte key
    const newApiKey = crypto.randomBytes(32).toString('hex')

    const { error } = await supabase
      .from('users')
      .update({ apikey: newApiKey })
      .eq('id', userId)

    if (error) {
      return NextResponse.json({ message: 'Gagal meregenerasi API Key', error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'API Key regenerated' })

  } catch (err: any) {
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 })
  }
}
