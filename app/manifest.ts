import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_SHORT_NAME } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: 'True cost, employer taxes and compliance risk of hiring developers abroad.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#2553eb',
    icons: [
      { src: '/brand/logo-mark-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/logo-mark-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
