'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'ID' | 'EN'

interface LanguageContextType {
  lang: Language
  setLang: (l: Language) => void
  t: (key: string) => any
}

const translations: any = {
  ID: {
    // Navbar
    home: 'Beranda',
    trending: 'Trending',
    api: 'API',
    donation: 'Donasi',
    profile: 'Profil',
    logout: 'Keluar',
    getStarted: 'Mulai',
    // Landing
    hero_tag: 'Pusat Streaming & Download Video No. 1',
    hero_title: 'Streaming Segalanya, Unduh di Mana Saja.',
    hero_subtitle: 'Platform terlengkap untuk menikmati konten video favorit Anda dengan kualitas terbaik dan akses API gratis bagi para developer.',
    hero_cta: 'Mulai Menonton',
    hero_secondary: 'Pelajari Dok API',
    features_title: 'Mengapa Memilih Kami?',
    // Member Home
    list_video: 'Daftar Video Streaming',
    search_placeholder: 'Cari judul film...',
    no_video: 'Belum ada video yang diunggah.',
    stream: 'Stream',
    copy: 'Salin',
    copy_success: 'Link berhasil disalin!',
    // Trending
    trending_tag: 'Trending Konten',
    trending_subtitle: 'Paling Banyak Ditonton & Terpopuler di Server',
    no_trending: 'Belum ada data trending saat ini.',
    // Profile
    my_profile: 'Profil Saya',
    profile_subtitle: 'Kelola Identitas & Keamanan Akun Anda',
    account_info: 'Informasi Akun',
    account_settings: 'Pengaturan Akun',
    full_name: 'Nama Lengkap',
    new_password: 'Password Baru',
    pass_hint: 'Minimal 6 karakter dengan kombinasi angka & simbol.',
    save_changes: 'Simpan Perubahan',
    regenerate_key: 'Regenerasi Key',
    careful_hint: 'Hati-hati: Meregenerasi API Key akan mematikan koneksi aplikasi lama Anda secara permanen.',
    // Auth
    welcome_back: 'Selamat Datang Kembali',
    secure_encryption: 'Enkripsi Aman Aktif',
    master_pass: 'Kunci Utama',
    confirm_access: 'Konfirmasi Akses',
    no_account: 'Belum punya akun?',
    init_reg: 'Inisialisasi Pendaftaran',
    create_account: 'Buat Akun',
    full_identity: 'Identitas Lengkap',
    instant_acc: 'Akses Instant Dimulai',
    reg_now: 'Daftar Sekarang',
    have_account: 'Sudah punya akun?',
    return_login: 'Kembali ke Login',
    login_success: 'Login berhasil! Mengalihkan...',
    invalid_cred: 'Email atau password salah',
    reg_success: 'Pendaftaran berhasil! Silakan login.',
    email_address: 'Alamat Email',
    password: 'Kata Sandi',
    forgot_password: 'Lupa Kata Sandi?',
    signin: 'Masuk',
    // API Docs
    api_title: 'Developer REST API',
    api_subtitle: 'Integrasi tanpa batas dengan MovieDB Engine.',
    your_api_key: 'Kunci API Anda',
    api_key_desc: 'Gunakan kunci ini untuk autentikasi setiap permintaan API Anda.',
    status_active: 'Aktif',
    short_docs: 'Dokumentasi Singkat',
    api_dev_in_progress: 'Endpoint ini sedang dalam pengembangan.',
    api_short_desc: 'Setiap endpoint mewajibkan parameter apikey dalam query string untuk verifikasi hak akses.',
    api_list_files: 'Daftar File & Streaming',
    api_upload_video: 'Upload Video ke Remote'
  },
  EN: {
    // Navbar
    home: 'Home',
    trending: 'Trending',
    api: 'API',
    donation: 'Donation',
    profile: 'Profile',
    logout: 'Logout',
    getStarted: 'Get Started',
    // Landing
    hero_tag: 'No. 1 Video Streaming & Download Hub',
    hero_title: 'Stream Everything, Download Anywhere.',
    hero_subtitle: 'The most comprehensive platform to enjoy your favorite video content with the best quality and free API access for developers.',
    hero_cta: 'Start Watching',
    hero_secondary: 'Read API Docs',
    features_title: 'Why Choose Us?',
    // Member Home
    list_video: 'List Video Streaming',
    search_placeholder: 'Search for movie title...',
    no_video: 'No videos uploaded yet.',
    stream: 'Stream',
    copy: 'Copy',
    copy_success: 'Link copied to clipboard!',
    // Trending
    trending_tag: 'Trending Content',
    trending_subtitle: 'Most Viewed & Popular on Server',
    no_trending: 'No trending data at this time.',
    // Profile
    my_profile: 'Profile',
    profile_subtitle: 'Manage Your Account Identity & Security',
    account_info: 'Account Information',
    account_settings: 'Account Settings',
    full_name: 'Full Name',
    new_password: 'New Password',
    pass_hint: 'Minimum 6 characters with numbers & symbols.',
    save_changes: 'Save Changes',
    regenerate_key: 'Regenerate Key',
    careful_hint: 'Careful: Regenerating key will permanently kill your old app connection.',
    // Auth
    welcome_back: 'Welcome Back',
    secure_encryption: 'Secure Encryption Active',
    master_pass: 'Master Password',
    confirm_access: 'Confirm Access',
    no_account: "Don't have an account?",
    init_reg: 'Initialize Registration',
    create_account: 'Create Account',
    full_identity: 'Full Identity',
    instant_acc: 'Instant Access Initialized',
    reg_now: 'Register Now',
    have_account: 'Already have an account?',
    return_login: 'Return to Login',
    login_success: 'Login successful! Redirecting...',
    invalid_cred: 'Invalid email or password',
    reg_success: 'Registration successful! Please login.',
    email_address: 'Email Address',
    password: 'Password',
    forgot_password: 'Forgot Password?',
    signin: 'Sign In',
    // API Docs
    api_title: 'Developer REST API',
    api_subtitle: 'Seamless integration with MovieDB Engine.',
    your_api_key: 'Your API Key',
    api_key_desc: 'Use this key to authenticate every API request.',
    status_active: 'Active',
    short_docs: 'Short Documentation',
    api_dev_in_progress: 'This endpoint is currently in development.',
    api_short_desc: 'Each endpoint requires the apikey parameter in the query string for access verification.',
    api_list_files: 'File List & Streaming',
    api_upload_video: 'Upload Video to Remote'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ID')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('site_lang') as Language
    if (saved && (saved === 'ID' || saved === 'EN')) {
      setLangState(saved)
    }
  }, [])

  const setLang = (l: Language) => {
    setLangState(l)
    localStorage.setItem('site_lang', l)
  }

  const t = (key: string) => {
    return translations[lang][key] || key
  }

  // Prevent hydration mismatch by not rendering until mounted
  // or return a provider with default values
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
