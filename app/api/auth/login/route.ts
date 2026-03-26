import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: 'Input tidak lengkap' }, { status: 400 })
    }

    // Cari user berdasarkan email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    // Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    if (user.status !== 'Active') {
      return NextResponse.json({ message: 'Your account is inactive' }, { status: 403 })
    }

    // Tentukan route tujuan berdasarkan level
    let redirectPath = '/member'
    if (user.level === 'Admin') {
      redirectPath = '/admin'
    }

    // Buat response
    const response = NextResponse.json({ 
      message: 'Login successful', 
      redirectPath: redirectPath,
      level: user.level,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }, { status: 200 })

    // Set cookie untuk level akses (Sangat disarankan memakai JWT untuk produksi)
    response.cookies.set('user_level', user.level, {
      path: '/',
      httpOnly: false, // Diperlukan agar client-side JS (Navbar) bisa mendeteksi login
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    })

    response.cookies.set('user_id', user.id, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    })

    return response

  } catch (err: any) {
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 })
  }
}
