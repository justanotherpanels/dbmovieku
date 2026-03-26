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
    address: 'Alamat',
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
    api_upload_video: 'Upload Video ke Remote',
    // Donation Page
    donation_title: 'Dukung Proyek Kami',
    donation_subtitle: 'Bantu operasional server kami tetap stabil dengan berdonasi melalui metode di bawah ini.',
    no_donation_methods: 'Belum ada metode donasi aktif.',
    payment_method: 'Metode Pembayaran',
    copy_details: 'Salin Detail',
    secure_transaction: 'Transaksi Aman',
    why_need_you: 'Kenapa Kami Membutuhkan Anda',
    // API Docs Page
    api_docs_title: 'Dokumentasi & Panduan Endpoint',
    api_key_auth: 'Kunci Autentikasi',
    api_base_url: 'Base URL',
    api_endpoints_title: 'Endpoints',
    api_get_files_desc: 'Panggil seluruh koleksi film dari semua server dalam satu kali permintaan HTTP. Data diurutkan berdasarkan waktu unggah terbaru secara global.',
    api_url_endpoint: 'URL Endpoint',
    api_response_body: 'Isi Respon',
    api_query_params: 'Parameter Query',
    api_param_name: 'Parameter',
    api_param_type: 'Tipe',
    api_param_req: 'Wajib',
    api_param_desc: 'Deskripsi',
    api_key_required_desc: 'API Key unik Anda dari halaman profil.',
    // Static Pages
    about_title: 'Tentang Kami',
    about_tagline: 'Kami adalah platform hiburan digital yang berfokus pada kemudahan akses konten video berkualitas tinggi dan penyampaian infrastruktur REST API yang kuat bagi para pengembang.',
    vision_title: 'Visi Kami',
    vision_desc: 'Menjadi jembatan antara konten hiburan global dengan audiens di seluruh penjuru dunia melalui teknologi distribusi video yang efisien, cepat, dan aman.',
    api_tech_title: 'Teknologi API',
    api_tech_desc: 'Penyediaan dokumentasi API yang stabil memungkinkan mitra pengembang kami untuk berinovasi tanpa harus mengkhawatirkan infrastruktur backend yang rumit.',
    about_story: 'Berawal dari semangat untuk menciptakan ekosistem distribusi video yang lebih transparan dan mudah diakses, Platform kami bertransformasi dari sebuah proyek kecil menjadi pusat sumber daya media digital yang dipercayai oleh ribuan pengguna setiap harinya. Kami percaya bahwa teknologi harus melayani manusia dengan cara yang paling sederhana dan seefektif mungkin.',
    privacy_title: 'Kebijakan Privasi',
    privacy_desc: 'Informasi tentang pengumpulan dan perlindungan data pribadi Anda.',
    data_collection_title: 'Pengumpulan Data',
    data_collection_desc: 'Sesuai dengan praktik perlindungan data yang ketat, kami hanya mengumpulkan alamat email dan nama pengguna untuk kepentingan autentikasi dan komunikasi transaksional esensial saja. Kami menjamin tidak ada data kredensial pihak ketiga yang tersimpan secara murni di dalam basis data kami tanpa enkripsi.',
    api_key_safety_title: 'Keamanan API Key',
    api_key_safety_desc: 'Setiap API Key yang dihasilkan unik bagi setiap pengguna dan harus dijaga kerahasiaannya. Kami tidak berhak menggunakan Kunci API Anda untuk keperluan di luar aktivitas monitoring performa teknis sistem internal kami sendiri.',
    third_party_title: 'Pihak Ketiga',
    third_party_desc: 'Kami tidak bekerja sama dengan pihak pengiklan luar untuk penyalahgunaan preferensi konten pengguna. Kepercayaan Anda adalah prioritas utama dalam membangun platform hiburan yang jujur dan aman.',
    last_updated: 'Diperbarui Terakhir',
    contact_us_prompt: 'Silakan hubungi kami untuk informasi lebih lanjut.',
    // Policy Page
    policy_title: 'Syarat dan Ketentuan',
    policy_subtitle: 'Syarat dan Ketentuan Penggunaan Layanan',
    policy_1_title: '1. Penggunaan Layanan',
    policy_1_desc: 'Setiap pengguna yang mengakses layanan kami sepakat untuk tidak menggunakan platform untuk aktivitas ilegal yang melanggar hukum di wilayah hukum masing-masing. Penyalahgunaan akses API dapat mengakibatkan pemblokiran akun secara permanen tanpa pemberitahuan terlebih dahulu.',
    policy_2_title: '2. Hak Kekayaan Intelektual',
    policy_2_desc: 'Kami sangat menghormati hak kekayaan intelektual. Seluruh konten yang diunggah ke server kami berada di bawah tanggung jawab pengunggah masing-masing. Kami akan menindaklanjuti setiap laporan DMCA dengan prosedur penghapusan konten yang valid sesuai aturan yang berlaku.',
    policy_3_title: '3. Batasan Tanggung Jawab',
    policy_3_desc: 'Kami tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul akibat gangguan server atau kehilangan data yang disebabkan oleh pihak ketiga di luar kendali teknis tim infrastruktur kami.',
    contact_legal: 'Hubungi Tim Legal',
    need_help: 'Butuh Bantuan Lebih Lanjut?'
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
    target_lang: 'English',
    address: 'Address',
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
    api_upload_video: 'Upload Video to Remote',
    // Donation Page
    donation_title: 'Support Our Projects',
    donation_subtitle: 'Help keep our server operational and stable by donating through the methods below.',
    no_donation_methods: 'No active donation methods yet.',
    payment_method: 'Payment Method',
    copy_details: 'Copy Details',
    secure_transaction: 'Secured Transaction',
    why_need_you: 'Why We Need You',
    // API Docs Page
    api_docs_title: 'Documentation & Endpoint Guide',
    api_key_auth: 'Authentication Key',
    api_base_url: 'Base URL',
    api_endpoints_title: 'Endpoints',
    api_get_files_desc: 'Fetch the entire movie collection from all servers in a single HTTP request. Data is sorted by the latest global upload time.',
    api_url_endpoint: 'URL Endpoint',
    api_response_body: 'Response Body',
    api_query_params: 'Query Parameters',
    api_param_name: 'Parameter',
    api_param_type: 'Type',
    api_param_req: 'Required',
    api_param_desc: 'Description',
    api_key_required_desc: 'Your unique API Key from the profile page.',
    // Static Pages
    about_title: 'About Us',
    about_tagline: 'We are a digital entertainment platform focused on ease of access to high-quality video content and providing robust REST API infrastructure for developers.',
    vision_title: 'Our Vision',
    vision_desc: 'To be a bridge between global entertainment content and audiences worldwide through efficient, fast, and secure video distribution technology.',
    api_tech_title: 'API Technology',
    api_tech_desc: 'Providing stable API documentation allows our developer partners to innovate without worrying about complex backend infrastructure.',
    about_story: 'Starting from the passion to create a more transparent and accessible video distribution ecosystem, our platform transformed from a small project into a digital media resource hub trusted by thousands of users every day. We believe that technology should serve humans in the simplest and most effective way possible.',
    privacy_title: 'Privacy Policy',
    privacy_desc: 'Information about the collection and protection of your personal data.',
    data_collection_title: 'Data Collection',
    data_collection_desc: 'In accordance with strict data protection practices, we only collect email addresses and usernames for essential authentication and transactional communication. We guarantee no pure third-party credentials are stored in our database without encryption.',
    api_key_safety_title: 'API Key Safety',
    api_key_safety_desc: 'Each generated API Key is unique for every user and must be kept confidential. We do not have the right to use your API Key for purposes outside of our own internal technical performance monitoring.',
    third_party_title: 'Third Parties',
    third_party_desc: 'We do not work with outside advertisers for the misuse of user content preferences. Your trust is our top priority in building an honest and secure entertainment platform.',
    last_updated: 'Last Updated',
    contact_us_prompt: 'Please contact us for more information.',
    // Policy Page
    policy_title: 'Terms of Service',
    policy_subtitle: 'Terms and Conditions of Service Usage',
    policy_1_title: '1. Service Usage',
    policy_1_desc: 'Each user who accesses our services agrees not to use the platform for illegal activities that violate the laws of their respective jurisdictions. Misuse of API access may result in a permanent account ban without prior notice.',
    policy_2_title: '2. Intellectual Property Rights',
    policy_2_desc: 'We highly respect intellectual property rights. All content uploaded to our servers is the responsibility of each respective uploader. We will follow up on any DMCA reports with valid content removal procedures in accordance with applicable rules.',
    policy_3_title: '3. Limitation of Liability',
    policy_3_desc: 'We are not responsible for direct or indirect losses arising from server disturbances or data loss caused by third parties outside of our technical infrastructure control.',
    contact_legal: 'Contact Legal Team',
    need_help: 'Need Further Help?'
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
