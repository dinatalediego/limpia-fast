import { NextRequest, NextResponse } from 'next/server';
import { storageConfigured, upsertWebLead } from '@/lib/supabase';

export const runtime = 'nodejs';
const allowedServices = new Set(['sofa', 'colchon', 'alfombra', 'sillas', 'varios']);

function clean(value: unknown, max = 180) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  const phone = clean(body.phone, 20).replace(/\D/g, '');
  const serviceType = clean(body.service_type, 40);
  const district = clean(body.district, 100);
  const name = clean(body.name, 100);

  if (!allowedServices.has(serviceType)) return NextResponse.json({ error: 'invalid_service' }, { status: 400 });
  if (!district) return NextResponse.json({ error: 'district_required' }, { status: 400 });
  if (!name) return NextResponse.json({ error: 'name_required' }, { status: 400 });
  if (phone.length < 11 || phone.length > 15) return NextResponse.json({ error: 'invalid_phone' }, { status: 400 });
  if (!storageConfigured()) return NextResponse.json({ error: 'storage_not_configured' }, { status: 503 });

  const referral = body.referral && typeof body.referral === 'object' ? body.referral as Record<string, unknown> : {};
  try {
    const lead = await upsertWebLead({ phone, name, service_type: serviceType, service_detail: clean(body.service_detail, 120), district, pain_point: clean(body.pain_point, 120), urgency: clean(body.urgency, 80), referral: { ...referral, landing_page: clean(referral.landing_page, 500), user_agent: request.headers.get('user-agent')?.slice(0, 300) } });
    return NextResponse.json({ ok: true, lead }, { status: 201 });
  } catch (error) {
    console.error('lead_submit_failed', error);
    return NextResponse.json({ error: 'lead_submit_failed' }, { status: 500 });
  }
}
