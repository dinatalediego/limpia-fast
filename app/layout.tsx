import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import AnalyticsBootstrap from '@/components/AnalyticsBootstrap';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://limpia-fast.vercel.app';
const gaId = process.env.NEXT_PUBLIC_GA_ID;
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Lavado de muebles a domicilio | LimpiaFast',
  description: 'Cotiza el lavado de tu sofá, colchón, alfombra o sillas a domicilio. Cuéntanos qué necesitas y envía una foto para recibir una cotización clara.',
  applicationName: 'LimpiaFast',
  alternates: { canonical: '/' },
  openGraph: { title: 'Tu casa vuelve a sentirse limpia | LimpiaFast', description: 'Lavado de muebles y tapicería a domicilio. Cotiza online o continúa por WhatsApp.', url: '/', siteName: 'LimpiaFast', locale: 'es_PE', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'LimpiaFast', description: 'Cotiza tu limpieza de muebles a domicilio.' },
  robots: { index: true, follow: true },
  icons: { icon: '/mark.svg', apple: '/mark.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>
    {gaId && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" /><Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}</Script></>}
    {pixelId && <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}</Script>}
    <AnalyticsBootstrap />{children}<Analytics /><SpeedInsights />
  </body></html>;
}
