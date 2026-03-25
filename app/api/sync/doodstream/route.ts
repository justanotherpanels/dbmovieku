import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // 1. Get API Key from api_server table
    const { data: config, error: configError } = await supabase
      .from('api_server')
      .select('api_config')
      .eq('type', 'Doodstream')
      .single()

    if (configError || !config) {
      return NextResponse.json({ 
        error: 'Doodstream API configuration not found in api_server table' 
      }, { status: 404 })
    }

    const apiKey = (config.api_config as any).apikey
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API Key (apikey) tidak ditemukan di konfigurasi JSON' 
      }, { status: 400 })
    }

    // 2. Fetch data from Doodstream API using native fetch
    const response = await fetch(`https://doodapi.co/api/folder/list?key=${apiKey}`)
    const doodData = await response.json()
    
    if (doodData.status !== 200) {
      return NextResponse.json({ 
        error: 'Doodstream API error', 
        details: doodData.msg 
      }, { status: 502 })
    }

    const { files, folders } = doodData.result
    let processedCount = 0

    // 3. Process and Upsert Files into server_2
    if (files && files.length > 0) {
        const fileInserts = files.map((file: any) => ({
          file_code: file.file_code,
          title: file.title,
          file_splash_img: file.splash_img,
          file_fld_id: file.fld_id,
          file_canplay: parseInt(file.canplay || '0'),
          file_download_url: file.download_url,
          file_length: parseInt(file.length || '0'),
          file_public: parseInt(file.public || '1'),
          file_uploaded: file.uploaded, // Format "2026-03-25 15:20:06" supported
          file_single_img: file.single_img,
          view_count: parseInt(file.views || '0'),
          views: parseInt(file.views || '0'),
          update_at: new Date().toISOString()
        }))

        // Upsert files matching on file_code
        const { error: upsertError } = await supabase
          .from('server_2')
          .upsert(fileInserts, { onConflict: 'file_code' })

        if (upsertError) {
          console.error('Upsert Files Error:', upsertError)
          throw new Error('Gagal menyimpan file ke database: ' + upsertError.message)
        }
        processedCount += fileInserts.length
    }

    // 4. Process Folders
    if (folders && folders.length > 0) {
      const folderInserts = folders.map((f: any) => ({
        folder_fld_id: f.fld_id,
        folder_name: f.name,
        folder_total_files: parseInt(f.total_files || '0'),
        folder_code: f.code,
        title: f.name,
        update_at: new Date().toISOString()
      }))
      
      const { error: folderError } = await supabase
        .from('server_2')
        .upsert(folderInserts, { onConflict: 'folder_fld_id' })
        
      if (folderError) console.error('Upsert Folders Error:', folderError)
    }

    return NextResponse.json({
      status: 200,
      message: 'Sync Doodstream completed',
      stats: {
        total_files: files?.length || 0,
        total_folders: folders?.length || 0,
        processed: processedCount
      }
    })

  } catch (err: any) {
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: err.message 
    }, { status: 500 })
  }
}
