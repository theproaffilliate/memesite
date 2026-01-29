import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reactions.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile/', '/settings/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
