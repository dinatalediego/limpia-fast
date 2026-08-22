'use client';

import { useState } from 'react';
import LeadWizard from '@/components/LeadWizard';
import { trackEvent } from '@/lib/analytics';

const BUSINESS_NUMBER = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || '51993984874';
const WHATSAPP = `https://wa.me/${BUSINESS_NUMBER}?text=${encodeURIComponent('Hola LimpiaFast, quiero cotizar una limpieza. ¿Me ayudan?')}`;

const services = [
  { code: '01', title: 'Sofás y salas', text: 'Para manchas, suciedad acumulada, olor o simplemente recuperar la sensación de una sala cuidada.', detail: '1, 2, 3 cuerpos · seccionales · juegos de sala' },
  { code: '02', title: 'Colchones', text: 'Limpieza profunda orientada a devolver una sensación de frescura y mantenimiento al espacio donde descansas.', detail: '1 plaza · 1.5 · 2 · queen · king' },
  { code: '03', title: 'Alfombras', text: 'Evaluamos medida, material y estado antes de confirmar el servicio para evitar cotizaciones ambiguas.', detail: 'hogar · sala · dormitorio' },
  { code: '04', title: 'Sillas y tapicería', text: 'Una ruta práctica para sillas de comedor, piezas tapizadas y combinaciones de varios muebles.', detail: 'unidades · juegos · combinaciones' },
];

const faq = [
  ['¿Cómo obtengo una cotización?', 'Completa el formulario con el tipo de mueble, tamaño aproximado, distrito y necesidad. Después puedes enviar una foto por WhatsApp para que el equipo confirme el caso.'],
  ['¿Tengo que llevar el mueble a algún lugar?', 'La propuesta de LimpiaFast es atención a domicilio. La cobertura exacta se confirma según el distrito antes de reservar.'],
  ['¿Por qué piden una foto?', 'Porque tamaño, material y nivel de suciedad pueden cambiar el trabajo necesario. La foto reduce ambigüedad y permite orientar mejor la cotización.'],
  ['¿El precio aparece en la web?', 'Todavía no publicamos precios que no hayan sido validados. Preferimos confirmar un monto con información real del mueble antes que mostrar una cifra engañosa.'],
  ['¿Cuánto tarda en secar?', 'Depende del material, la ventilación y las condiciones del día. El equipo te dará una estimación para tu caso al coordinar.'],
  ['¿Puedo cotizar varias cosas juntas?', 'Sí. Selecciona “Varias cosas” en el cotizador y describe la combinación al continuar por WhatsApp.'],
];

function WhatsAppLink({ origin, children, className = 'button button-secondary' }: { origin: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={WHATSAPP} target="_blank" rel="noreferrer" onClick={() => trackEvent('whatsapp_click', { origin })}>{children}</a>;
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'LimpiaFast',
    description: 'Lavado de muebles, colchones, alfombras y tapicería a domicilio.',
    telephone: '+51 993 984 874',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://limpia-fast.vercel.app',
    makesOffer: services.map((service) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service.title } })),
  };

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header className="site-header">
      <a href="#inicio" className="brand" aria-label="LimpiaFast, inicio"><span className="brand-mark">LF</span><span>LimpiaFast</span></a>
      <nav aria-label="Principal"><a href="#servicios">Servicios</a><a href="#proceso">Cómo funciona</a><a href="#preguntas">Preguntas</a></nav>
      <a className="header-cta" href="#cotizar" onClick={() => trackEvent('CTA_click', { origin: 'header', cta: 'cotizar' })}>Cotizar <span aria-hidden="true">↘</span></a>
    </header>

    <section className="hero" id="inicio">
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-copy">
        <div className="local-badge"><span /> Atención a domicilio · cobertura por confirmar</div>
        <h1>Tu casa vuelve a sentirse <em>limpia.</em></h1>
        <p className="hero-lead">Lavado de sofás, colchones, alfombras y tapicería para recuperar ese mueble que ya se ve o se siente sucio — sin perder tiempo buscando cómo cotizar.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#cotizar" onClick={() => trackEvent('CTA_click', { origin: 'hero', cta: 'cotizar' })}>Cotizar en la web <span aria-hidden="true">↓</span></a>
          <WhatsAppLink origin="hero">Prefiero WhatsApp <span aria-hidden="true">↗</span></WhatsAppLink>
        </div>
        <div className="hero-proof"><div><strong>1.</strong><span>Cuéntanos qué quieres limpiar.</span></div><div><strong>2.</strong><span>Envía una foto.</span></div><div><strong>3.</strong><span>Confirmamos precio y coordinación.</span></div></div>
      </div>
      <div className="hero-art" aria-label="Visualización del flujo de cotización">
        <div className="material-card material-before"><span className="material-label">Antes de reemplazarlo</span><div className="fabric fabric-a" /><p>¿Mancha, olor o desgaste visible?</p></div>
        <div className="material-card material-after"><span className="material-label accent">Primero, evaluemos</span><div className="fabric fabric-b"><span className="scan-line" /></div><div className="scan-data"><span>material</span><span>tamaño</span><span>estado</span><span>urgencia</span></div></div>
        <div className="floating-note">Una foto puede ahorrarte varias preguntas <span>↗</span></div>
      </div>
    </section>

    <section className="statement section-shell"><p className="section-kicker">El problema no es “lavar un mueble”</p><div className="statement-grid"><h2>Es volver a disfrutar el espacio sin la sensación de que algo está pendiente.</h2><div><p>Una mancha, un olor, polvo acumulado o una visita próxima convierten un mueble útil en una pequeña incomodidad diaria.</p><p>LimpiaFast está diseñado para resolver ese momento con una experiencia simple: contexto primero, cotización clara después, servicio a domicilio al final.</p></div></div></section>

    <section className="services section-shell" id="servicios">
      <div className="section-head"><div><p className="section-kicker">Qué puedes recuperar</p><h2>Empieza por el resultado que quieres sentir.</h2></div><p>No organizamos la oferta como un catálogo técnico. Elige el mueble que hoy te está generando fricción.</p></div>
      <div className="service-list">{services.map((service) => <article key={service.code} className="service-row" onMouseEnter={() => trackEvent('service_viewed', { service: service.title })}><span className="service-code">{service.code}</span><div><h3>{service.title}</h3><p>{service.text}</p></div><span className="service-detail">{service.detail}</span><a href="#cotizar" aria-label={`Cotizar ${service.title}`} onClick={() => trackEvent('CTA_click', { origin: 'service', service: service.title })}>↘</a></article>)}</div>
    </section>

    <section className="quote-zone" id="cotizar">
      <div className="quote-copy"><p className="section-kicker light">Cotiza sin empezar de cero en un chat</p><h2>Cuatro pasos. Menos preguntas después.</h2><p>El formulario recoge exactamente el contexto que el flujo comercial necesita: qué quieres limpiar, tamaño, distrito, problema y urgencia.</p><div className="data-cards"><div><span>01</span><strong>Más contexto</strong><p>Una cotización mejor empieza con datos útiles.</p></div><div><span>02</span><strong>Menos fricción</strong><p>WhatsApp queda para la foto y el cierre, no para repetir lo básico.</p></div><div><span>03</span><strong>Más señal</strong><p>Cada solicitud conserva su fuente y campaña para aprender qué tráfico sí convierte.</p></div></div></div>
      <LeadWizard />
    </section>

    <section className="process section-shell" id="proceso">
      <div className="section-head"><div><p className="section-kicker">De intención a servicio</p><h2>Sabes qué pasa en cada momento.</h2></div><p>La confianza mejora cuando la siguiente acción es evidente y no hay sorpresas entre “quiero cotizar” y “ya quedó reservado”.</p></div>
      <div className="process-track"><article><span>01</span><div className="process-visual p1" /><h3>Describe</h3><p>Tipo, tamaño, distrito y qué quieres resolver.</p></article><article><span>02</span><div className="process-visual p2" /><h3>Muestra</h3><p>Envía una foto para reducir ambigüedad sobre material y estado.</p></article><article><span>03</span><div className="process-visual p3" /><h3>Confirma</h3><p>Revisamos el caso y coordinamos precio, cobertura y horario.</p></article><article><span>04</span><div className="process-visual p4" /><h3>Recupera</h3><p>El servicio ocurre a domicilio según lo coordinado.</p></article></div>
    </section>

    <section className="certainty section-shell">
      <div className="certainty-card"><p className="section-kicker light">Lo que sí prometemos en la web</p><h2>Claridad antes de venderte.</h2><div className="certainty-grid"><div><span>✓</span><p>La cotización parte de información real de tu mueble.</p></div><div><span>✓</span><p>La cobertura se confirma antes de reservar.</p></div><div><span>✓</span><p>No publicamos cifras o garantías que aún no estén validadas.</p></div><div><span>✓</span><p>Puedes empezar en la web o ir directo a WhatsApp.</p></div></div><WhatsAppLink origin="certainty" className="button button-light">Hablar con LimpiaFast <span aria-hidden="true">↗</span></WhatsAppLink></div>
      <div className="certainty-aside"><span className="giant-quote">“</span><p>Antes de cambiarlo, veamos si podemos recuperarlo.</p><small>Concepto de “rescate” en validación dentro del Market Research de LimpiaFast.</small></div>
    </section>

    <section className="faq section-shell" id="preguntas"><div className="faq-title"><p className="section-kicker">Antes de escribirnos</p><h2>Preguntas que vale la pena resolver.</h2></div><div className="faq-list">{faq.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={question}><button type="button" aria-expanded={openFaq === index} onClick={() => { setOpenFaq(openFaq === index ? null : index); trackEvent('faq_interaction', { question }); }}><span>{question}</span><span aria-hidden="true">{openFaq === index ? '−' : '+'}</span></button><div className="faq-answer"><p>{answer}</p></div></div>)}</div></section>

    <section className="final-cta"><div><p className="section-kicker light">¿Hay un mueble que ya evitabas mirar?</p><h2>Puede que no necesites reemplazarlo. Empieza por una foto.</h2></div><div className="final-actions"><a className="button button-light" href="#cotizar" onClick={() => trackEvent('CTA_click', { origin: 'final', cta: 'cotizar' })}>Cotizar ahora <span>↓</span></a><WhatsAppLink origin="final" className="button button-outline-light">WhatsApp <span>↗</span></WhatsAppLink></div></section>

    <footer className="footer"><div className="footer-brand"><div className="brand"><span className="brand-mark">LF</span><span>LimpiaFast</span></div><p>Lavado de muebles y tapicería a domicilio.</p></div><div><span className="footer-label">Servicios</span><a href="#servicios">Sofás</a><a href="#servicios">Colchones</a><a href="#servicios">Alfombras</a><a href="#servicios">Sillas</a></div><div><span className="footer-label">Contacto</span><a href={WHATSAPP} target="_blank" rel="noreferrer">+51 993 984 874</a><a href="#cotizar">Solicitar cotización</a><a href="#preguntas">Preguntas frecuentes</a></div><div className="footer-meta"><span>Cobertura según distrito</span><span>© {new Date().getFullYear()} LimpiaFast</span></div></footer>
    <a className="mobile-sticky" href="#cotizar" onClick={() => trackEvent('CTA_click', { origin: 'mobile_sticky', cta: 'cotizar' })}>Cotizar <span>→</span></a>
  </main>;
}
