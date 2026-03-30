import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Input tidak lengkap' }, { status: 400 })
    }

    // Server-side email validation
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com']
    const emailParts = email.split('@')
    const domain = emailParts[1]?.toLowerCase()
    const prefix = emailParts[0]

    if (!allowedDomains.includes(domain)) {
      return NextResponse.json({ message: 'Domain email tidak diperbolehkan. Gunakan Gmail, Yahoo, atau Outlook.' }, { status: 400 })
    }

    const dotCount = (prefix.match(/\./g) || []).length
    if (dotCount > 1) {
      return NextResponse.json({ message: 'Format email tidak valid (terlalu banyak titik).' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Generate initial API Key
    const newApiKey = crypto.randomBytes(32).toString('hex')

    // Simpan ke tabel public.users
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          name, 
          email, 
          password: hashedPassword,
          apikey: newApiKey,
          level: 'Member', 
          status: 'Active' 
        }
      ])
      .select()

    if (error) {
      return NextResponse.json({ message: 'Registrasi gagal', error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Registrasi berhasil', user: data[0] }, { status: 201 })

  } catch (err: any) {
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 })
  }
}
