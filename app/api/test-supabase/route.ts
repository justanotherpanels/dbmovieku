import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Mencoba melakukan query sederhana ke Supabase.
    // Jika tidak ada tabel pun, kita bisa melihat apakah requestnya terkirim dengan baik.
    const { data, error } = await supabase.from('_test_connection_').select('*').limit(1)

    // PGRST205: Could not find table (Berarti API & Key sudah benar tapi tabel memang tidak ada)
    // 42P01: Relation not found
    if (error && error.code !== 'PGRST116' && error.code !== '42P01' && error.code !== 'PGRST205') {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Koneksi gagal atau Key salah',
        error: error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Koneksi ke Supabase API berhasil!',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    })

  } catch (err: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: err.message 
    }, { status: 500 })
  }
}
