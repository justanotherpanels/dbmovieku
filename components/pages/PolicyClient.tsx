'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function PolicyClient({ siteName }: { siteName: string }) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-6">
           <span className="text-sm font-black text-indigo-500 uppercase tracking-[0.3em]">Legal & Compliance</span>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">{t('policy_title')}</h1>
           <p className="text-zinc-500 text-sm max-w-xl font-medium">{t('policy_subtitle')} {siteName}.</p>
        </div>

        {/* Content */}
        <div className="space-y-16 py-12 border-t border-zinc-900">
           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">{t('policy_1_title')}</h2>
              <p className="text-zinc-500 text-sm leading-8 font-medium">
                {t('policy_1_desc').replace('platform', siteName)}
              </p>
           </div>

           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">{t('policy_2_title')}</h2>
              <p className="text-zinc-500 text-sm leading-8 font-medium">
                {t('policy_2_desc').replace('server kami', `server ${siteName}`)}
              </p>
           </div>

           <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">{t('policy_3_title')}</h2>
              <p className="text-zinc-500 text-sm leading-8 font-medium">
                {t('policy_3_desc')}
              </p>
           </div>
        </div>

        {/* Action Call */}
        <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-[32px] text-center space-y-4">
           <p className="text-zinc-500 text-sm font-bold">{t('need_help')}</p>
           <button className="h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-indigo-600/20">
              {t('contact_legal')}
           </button>
        </div>
      </div>
    </div>
  )
}
