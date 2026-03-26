'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function AboutUsClient({ siteName }: { siteName: string }) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-6 text-center md:text-left">
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">{t('about_title')}</h1>
           <div className="w-20 h-2 bg-indigo-600 rounded-full"></div>
           <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
             {t('about_tagline')}
           </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[32px] space-y-4">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">{t('vision_title')}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                {t('vision_desc')}
              </p>
           </div>
           <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[32px] space-y-4">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">{t('api_tech_title')}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                {t('api_tech_desc')}
              </p>
           </div>
        </div>

        {/* Story Content */}
        <div className="prose prose-invert prose-zinc max-w-none border-t border-zinc-900 pt-12">
           <p className="text-zinc-500 leading-8">
             {t('about_story').replace('Platform kami', siteName)}
           </p>
        </div>
      </div>
    </div>
  )
}
