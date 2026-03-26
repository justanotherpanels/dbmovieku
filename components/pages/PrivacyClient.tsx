'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function PrivacyClient({ siteName }: { siteName: string }) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-6">
           <span className="text-sm font-black text-emerald-500 uppercase tracking-[0.3em]">Data & Safety</span>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">{t('privacy_title')}</h1>
           <p className="text-zinc-500 text-sm max-w-xl font-medium">{t('privacy_desc')}</p>
        </div>

        {/* Content Section */}
        <div className="space-y-16 py-12 border-t border-zinc-900 font-sans">
           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">{t('data_collection_title')}</h2>
              <p className="text-zinc-500 text-sm leading-8 font-medium">
                {t('data_collection_desc').replace('Basis data kami', siteName)}
              </p>
           </div>

           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">{t('api_key_safety_title')}</h2>
              <p className="text-zinc-500 text-sm leading-8 font-medium">
                {t('api_key_safety_desc').replace('Platform kami', siteName)}
              </p>
           </div>

           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">{t('third_party_title')}</h2>
              <p className="text-zinc-500 text-sm leading-8 font-medium">
                {t('third_party_desc')}
              </p>
           </div>
        </div>

        {/* Action Call */}
        <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-[40px] flex flex-col items-center gap-6">
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center">{t('last_updated')}: Maret 2026</p>
           <div className="h-1.5 w-16 bg-zinc-800 rounded-full"></div>
           <p className="text-zinc-500 text-sm font-bold text-center">{t('contact_us_prompt')}</p>
        </div>
      </div>
    </div>
  )
}
