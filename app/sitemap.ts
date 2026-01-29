import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reactions.com';

  // Static routes
  const routes = [
    '',
    '/auth',
    '/upload',
    '/contact',
    '/help',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic meme routes
  let memes: any[] = [];
  try {
    const { data } = await supabase
      .from('memes')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(1000);
    memes = data || [];
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  const memeRoutes = memes.map((meme) => ({
    url: `${baseUrl}/meme/${meme.id}`,
    lastModified: new Date(meme.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...memeRoutes];
}
