## What It Contains

* Exports a Next.js robots configuration that generates robots.txt

* Sets base URL from NEXT\_PUBLIC\_SITE\_URL or defaults to <https://reactions.com>

* Allows all crawling under '/'

* Disallows sensitive areas: '/profile/', '/settings/', '/api/'

* Points crawlers to the sitemap at `${baseUrl}/sitemap.xml`

## Current Code

```
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
```

