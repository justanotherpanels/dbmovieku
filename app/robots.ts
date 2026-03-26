import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Common case
    },
    sitemap: 'https://dbmovie.net/sitemap.xml',
  }
}
