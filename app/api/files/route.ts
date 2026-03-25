import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Rate Limiting Store (In-memory for development/local server)
const rateLimitStore = new Map<string, { count: number, resetTime: number }>()

const RATE_LIMIT = 10
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 Menit dalam milidetik

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const apiKey = searchParams.get('apikey')

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key is required' }, { status: 401 })
  }

  // 1. Validasi API Key pengguna & Ambil User ID
  const { data: user, error: authError } = await supabase
    .from('users')
    .select('id')
    .eq('apikey', apiKey)
    .single()

  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 })
  }

  // 2. Implementasi Rate Limiting
  const now = Date.now()
  const userRateData = rateLimitStore.get(apiKey)

  if (!userRateData || now > userRateData.resetTime) {
    // Reset atau buat entri baru jika window sudah lewat
    rateLimitStore.set(apiKey, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
  } else {
    // Cek jika kuota sudah habis
    if (userRateData.count >= RATE_LIMIT) {
      const waitSeconds = Math.ceil((userRateData.resetTime - now) / 1000)
      return NextResponse.json({ 
        error: 'Too Many Requests', 
        message: `Batas limit 10x per menit terlampaui. Silakan tunggu ${waitSeconds} detik lagi.`,
        remaining_seconds: waitSeconds
      }, { 
        status: 429,
        headers: {
          'Retry-After': waitSeconds.toString(),
          'X-RateLimit-Limit': RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': '0'
        }
      })
    }
    // Tambahkan jumlah hit
    userRateData.count += 1
  }

  // 3. Ambil data dari Server 1 (Streamtape)
  const { data: s1 } = await supabase
    .from('server_1')
    .select('*')
    .order('file_created_at', { ascending: false })

  // 4. Ambil data dari Server 2 (Doodstream)
  const { data: s2 } = await supabase
    .from('server_2')
    .select('*')
    .not('file_download_url', 'is', null)
    .order('file_uploaded', { ascending: false })

  // 5. Mapping dan Standarisasi Output
  const combined = [
    ...(s1 || []).map(item => ({
      id: item.id,
      title: item.file_name,
      link: item.file_link,
      size_bytes: item.file_size || 0,
      views: item.file_download || 0,
      created_at: item.file_created_at || item.create_at
    })),
    ...(s2 || []).map(item => ({
      id: item.id,
      title: item.title,
      link: item.file_download_url,
      size_bytes: item.file_length || 0,
      views: item.view_count || 0,
      created_at: item.file_uploaded || item.create_at
    }))
  ]

  combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // Kirim respons sukses dengan header limit
  const response = NextResponse.json({
    status: 'success',
    total_results: combined.length,
    data: combined
  })

  response.headers.set('X-RateLimit-Limit', RATE_LIMIT.toString())
  response.headers.set('X-RateLimit-Remaining', (RATE_LIMIT - (rateLimitStore.get(apiKey)?.count || 0)).toString())

  return response
}
