import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dbmovie.net'

  // Define your static routes
  const staticRoutes = [
    '',
    '/auth/login',
    '/auth/register',
    '/page/about-us',
    '/page/donation',
    '/page/policy',
    '/page/privacy',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return sitemapEntries
}
