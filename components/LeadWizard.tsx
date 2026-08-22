'use client';

import { FormEvent, useMemo, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { getAttribution } from '@/lib/utm';

type FormData = {
  service_type: string;
  service_detail: string;
  district: string;
  pain_point: string;
  urgency: string;
  name: string;
  phone: string;
};

const services = [
  { value: 'sofa', label: 'Sofá / sala', icon: '⌁' },
  { value: 'colchon', label: 'Colchón', icon: '▭' },
  { value: 'alfombra', label: 'Alfombra', icon: '▦' },
  { value: 'sillas', label: 'Sillas', icon: '◇' },
  { value: 'varios', label: 'Varias cosas', icon: '+' },
];

const details: Record<string, string[]> = {
  sofa: ['1 cuerpo', '2 cuerpos', '3 cuerpos', 'Seccional / L', 'Juego de sala', 'Otro'],
  colchon: ['1 plaza', '1.5 plazas', '2 plazas', 'Queen', 'King', 'Otro'],
  alfombra: ['Pequeña', 'Mediana', 'Grande', 'No sé la medida'],
  sillas: ['1–2 sillas', '3–4 sillas', '5–8 sillas', '9 o más'],
  varios: ['Sala + colchón', 'Sala + sillas', 'Sala + alfombra', 'Quiero combinar varios'],
};

const painPoints = ['Mancha visible', 'Suciedad acumulada', 'Olor', 'Mantenimiento', 'Mascotas / niños', 'Quiero que se vea mejor', 'Otro'];
const urgencies = ['Hoy / mañana', 'Esta semana', 'Próxima semana', 'Solo estoy cotizando'];

const initial: FormData = { service_type: '', service_detail: '', district: '', pain_point: '', urgency: '', name: '', phone: '' };

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('51') && digits.length === 11) return digits;
  if (digits.length === 9) return `51${digits}`;
  return digits;
}

export default function LeadWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initial);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [leadId, setLeadId] = useState<string | null>(null);
  const businessNumber = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || '51993984874';

  const serviceLabel = useMemo(() => services.find((service) => service.value === data.service_type)?.label || 'servicio', [data.service_type]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((current) => ({ ...current, [key]: value }));
  }

  function advance() {
    if (step === 0 && !data.service_type) return;
    if (step === 1 && !data.service_detail) return;
    if (step === 2 && (!data.district.trim() || !data.pain_point || !data.urgency)) return;
    trackEvent(step === 0 ? 'form_started' : 'form_step_completed', { step: step + 1, service_type: data.service_type || undefined });
    setStep((current) => Math.min(current + 1, 3));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const phone = normalizePhone(data.phone);
    if (phone.length < 11 || !data.name.trim()) return;
    setStatus('loading');
    trackEvent('form_submit_attempt', { service_type: data.service_type, district: data.district });

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, phone, referral: getAttribution() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || 'lead_submit_failed');
      setLeadId(result?.lead?.id || null);
      setStatus('success');
      trackEvent('form_submitted', { service_type: data.service_type, district: data.district, urgency: data.urgency });
      trackEvent('conversion', { type: 'web_lead', service_type: data.service_type });
    } catch {
      setStatus('error');
      trackEvent('form_error', { service_type: data.service_type });
    }
  }

  const whatsappText = encodeURIComponent(`Hola LimpiaFast, ya completé la cotización web. Quiero limpiar: ${serviceLabel} (${data.service_detail}). Distrito: ${data.district || 'por confirmar'}. ${leadId ? `Referencia: ${leadId.slice(0, 8)}.` : ''} Quiero enviar una foto.`);
  const whatsappHref = `https://wa.me/${businessNumber}?text=${whatsappText}`;

  if (status === 'success') {
    return <div className="wizard success-panel" aria-live="polite">
      <span className="success-mark" aria-hidden="true">✓</span>
      <p className="eyebrow">Solicitud recibida</p>
      <h3>Ya tenemos el contexto. Falta la foto.</h3>
      <p>Envíala por WhatsApp para que el equipo pueda revisar el mueble y confirmar la cotización sin hacerte repetir todo.</p>
      <a className="button button-primary button-wide" href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => trackEvent('whatsapp_click', { origin: 'form_success', service_type: data.service_type })}>Enviar foto por WhatsApp <span aria-hidden="true">↗</span></a>
      <button className="text-button" type="button" onClick={() => { setData(initial); setStep(0); setStatus('idle'); }}>Hacer otra cotización</button>
    </div>;
  }

  return <form className="wizard" onSubmit={submit} noValidate>
    <div className="wizard-head">
      <div><p className="eyebrow">Cotización rápida</p><h2>{step === 0 ? '¿Qué quieres limpiar?' : step === 1 ? 'Cuéntanos el tamaño' : step === 2 ? '¿Dónde y qué quieres resolver?' : '¿Dónde te respondemos?'}</h2></div>
      <span className="step-count" aria-label={`Paso ${step + 1} de 4`}>{step + 1}/4</span>
    </div>
    <div className="progress" aria-hidden="true"><span style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>

    {step === 0 && <fieldset className="choice-grid service-choice"><legend className="sr-only">Selecciona un servicio</legend>{services.map((service) => <button key={service.value} type="button" className={`choice ${data.service_type === service.value ? 'selected' : ''}`} onClick={() => { update('service_type', service.value); update('service_detail', ''); trackEvent('service_viewed', { service_type: service.value }); }} aria-pressed={data.service_type === service.value}><span className="choice-icon" aria-hidden="true">{service.icon}</span><span>{service.label}</span></button>)}</fieldset>}

    {step === 1 && <fieldset className="choice-grid detail-choice"><legend className="sr-only">Selecciona tamaño o cantidad</legend>{(details[data.service_type] || ['Quiero orientación']).map((detail) => <button key={detail} type="button" className={`choice ${data.service_detail === detail ? 'selected' : ''}`} onClick={() => update('service_detail', detail)} aria-pressed={data.service_detail === detail}><span>{detail}</span></button>)}</fieldset>}

    {step === 2 && <div className="field-stack">
      <label className="field"><span>Distrito</span><input value={data.district} onChange={(e) => update('district', e.target.value)} placeholder="Ej. Huacho" autoComplete="address-level2" /><small>La cobertura y traslado se confirman antes de reservar.</small></label>
      <label className="field"><span>Principal motivo</span><select value={data.pain_point} onChange={(e) => update('pain_point', e.target.value)}><option value="">Selecciona una opción</option>{painPoints.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="field"><span>¿Para cuándo?</span><select value={data.urgency} onChange={(e) => update('urgency', e.target.value)}><option value="">Selecciona una opción</option>{urgencies.map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>}

    {step === 3 && <div className="field-stack">
      <label className="field"><span>Tu nombre</span><input value={data.name} onChange={(e) => update('name', e.target.value)} placeholder="¿Cómo te llamas?" autoComplete="name" /></label>
      <label className="field"><span>WhatsApp / celular</span><div className="phone-field"><span>+51</span><input value={data.phone} onChange={(e) => update('phone', e.target.value)} inputMode="tel" placeholder="999 999 999" autoComplete="tel" /></div></label>
      <p className="privacy-note">Usaremos tus datos solo para responder esta solicitud y dar seguimiento a la cotización.</p>
      {status === 'error' && <div className="form-error" role="alert">No pudimos guardar la solicitud. Puedes reintentar o continuar directamente por WhatsApp.</div>}
    </div>}

    <div className="wizard-actions">
      {step > 0 && <button type="button" className="button button-ghost" onClick={() => setStep((current) => current - 1)}>Atrás</button>}
      {step < 3 ? <button type="button" className="button button-primary" onClick={advance}>Continuar <span aria-hidden="true">→</span></button> : <button type="submit" className="button button-primary" disabled={status === 'loading'}>{status === 'loading' ? 'Enviando…' : 'Solicitar cotización'} <span aria-hidden="true">→</span></button>}
    </div>
    <div className="wizard-foot"><span aria-hidden="true">●</span> Sin pago · sin compromiso · primero confirmamos el caso</div>
  </form>;
}
