import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Hide internal APIs and admin area from crawlers
    },
    sitemap: 'https://mattprojects.com/sitemap.xml',
  }
}
