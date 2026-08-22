# LimpiaFast — Conversion Landing

Landing comercial independiente del Growth OS de [`dinatalediego/expertos_en_lavados`](https://github.com/dinatalediego/expertos_en_lavados).

## Objetivo

Convertir tráfico de Meta, Google, QR o referencias en una solicitud de cotización medible **sin obligar al visitante a empezar por WhatsApp**.

Flujo principal:

`landing → cotizador progresivo → lead persistido → WhatsApp para foto → cotización → reserva`

## Stack

- Next.js App Router + TypeScript
- Vercel Analytics + Speed Insights
- Supabase REST server-side (reutiliza la tabla `leads` del Growth OS)
- GA4 / Meta Pixel opcionales por variables de entorno
- CSS propio, sin framework UI y sin imágenes de stock

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variables de entorno

```bash
SUPABASE_URL=https://hssqdpwffmystuagtntg.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
NEXT_PUBLIC_BUSINESS_WHATSAPP=51993984874
NEXT_PUBLIC_SITE_URL=https://limpia-fast.vercel.app
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
```

Nunca expongas `SUPABASE_SECRET_KEY` con prefijo `NEXT_PUBLIC_`.

## Eventos

- `page_view`
- `CTA_click`
- `whatsapp_click`
- `form_started`
- `form_step_completed`
- `form_submit_attempt`
- `form_submitted`
- `form_error`
- `service_viewed`
- `faq_interaction`
- `scroll_depth`
- `conversion`

Los UTMs se conservan en el navegador y llegan al campo `referral` del lead.

## Healthcheck

`GET /api/health`

Debe devolver `storage: "supabase"` en producción antes de comprar tráfico.

## Criterio de lanzamiento

No considerar el funnel listo para pauta hasta validar:

1. build exitoso;
2. `/api/health` con Supabase configurado;
3. lead de prueba visible en `leads`;
4. CTA de WhatsApp correcto;
5. UTMs persistidos;
6. mobile 320/375/390/430 px;
7. eventos visibles en analytics.
