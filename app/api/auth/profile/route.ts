import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

// GET: Fetch User Profile
export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, level, status, apikey')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })

  } catch (err: any) {
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 })
  }
}

// PUT: Update Name & Password
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value
    const { name, password } = await req.json()

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const updates: any = {}
    if (name) updates.name = name
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ message: 'Password minimal 6 karakter' }, { status: 400 })
      }
      updates.password = await bcrypt.hash(password, 10)
    }

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)

    if (error) {
      return NextResponse.json({ message: 'Gagal memperbarui data', error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Profile updated successfully' })

  } catch (err: any) {
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 })
  }
}
