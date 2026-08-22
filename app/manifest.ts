import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return { name: 'LimpiaFast', short_name: 'LimpiaFast', description: 'Lavado de muebles, colchones, alfombras y tapicería a domicilio.', start_url: '/', display: 'standalone', background_color: '#f4f4ec', theme_color: '#10211b', icons: [{ src: '/mark.svg', sizes: 'any', type: 'image/svg+xml' }] };
}
