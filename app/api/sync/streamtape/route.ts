import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Menggunakan anon key
)

export async function POST(request: NextRequest) {
  try {
    // 1. Fetch all API configurations for Streamtape
    const { data: configs, error: configError } = await supabase
      .from('api_server')
      .select('api_config')
      .eq('type', 'Streamtape')

    if (configError) throw configError
    if (!configs || configs.length === 0) {
      return NextResponse.json({ error: 'Tidak ada konfigurasi API Streamtape ditemukan' }, { status: 404 })
    }

    const allApiFiles: any[] = []
    const allApiLinkIds = new Set<string>()

    // 2. Fetch files from each API config
    for (const conf of configs) {
      const { login, key } = conf.api_config as { login: string; key: string }
      if (!login || !key) continue

      const url = `https://api.streamtape.com/file/listfolder?login=${login}&key=${key}`
      const response = await fetch(url)
      const result = await response.json()

      if (result.status === 200 && result.result?.files) {
        for (const file of result.result.files) {
          if (!allApiLinkIds.has(file.linkid)) {
            allApiLinkIds.add(file.linkid)
            allApiFiles.push({
              file_name: file.name,
              file_size: parseInt(file.size),
              file_link: file.link,
              file_created_at: new Date(file.created_at * 1000).toISOString(),
              file_download: parseInt(file.downloads),
              file_linkid: file.linkid,
              file_convert: file.convert
            })
          }
        }
      }
    }

    // 3. Get all current files from DB
    const { data: dbFiles, error: dbFetchError } = await supabase
      .from('server_1')
      .select('id, file_linkid')

    if (dbFetchError) throw dbFetchError

    const dbLinkIds = new Set(dbFiles?.map(f => f.file_linkid) || [])
    
    // 4. Determine Inserts & Deletes
    const filesToInsert = allApiFiles.filter(f => !dbLinkIds.has(f.file_linkid))
    const linkIdsToDelete = Array.from(dbLinkIds).filter(id => id && !allApiLinkIds.has(id))

    let insertedCount = 0
    let deletedCount = 0

    // 5. Perform Database Operations
    if (filesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('server_1')
        .insert(filesToInsert)
      if (insertError) throw insertError
      insertedCount = filesToInsert.length
    }

    if (linkIdsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('server_1')
        .delete()
        .in('file_linkid', linkIdsToDelete)
      if (deleteError) throw deleteError
      deletedCount = linkIdsToDelete.length
    }

    return NextResponse.json({
      success: true,
      message: 'Sinkronisasi berhasil',
      stats: {
        total_api: allApiFiles.length,
        inserted: insertedCount,
        deleted: deletedCount
      }
    })

  } catch (error: any) {
    console.error('Sync Error:', error)
    return NextResponse.json({ error: 'Gagal sinkronisasi: ' + error.message }, { status: 500 })
  }
}
