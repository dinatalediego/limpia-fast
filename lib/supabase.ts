type LeadInput = {
  phone: string;
  name?: string;
  service_type: string;
  service_detail?: string;
  district: string;
  pain_point?: string;
  urgency?: string;
  referral?: Record<string, unknown>;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

function headers(extra: Record<string, string> = {}) {
  if (!supabaseKey) return extra;
  const auth: Record<string, string> = {
    apikey: supabaseKey,
    'Content-Type': 'application/json',
  };
  if (!supabaseKey.startsWith('sb_secret_')) auth.Authorization = `Bearer ${supabaseKey}`;
  return { ...auth, ...extra };
}

export function storageConfigured() {
  return Boolean(supabaseUrl && supabaseKey);
}

async function request(path: string, options: RequestInit) {
  if (!supabaseUrl || !supabaseKey) throw new Error('storage_not_configured');
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: headers(options.headers as Record<string, string> | undefined),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`supabase_${response.status}:${await response.text()}`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function upsertWebLead(input: LeadInput) {
  const payload = {
    phone: input.phone,
    name: input.name || null,
    service_type: input.service_type,
    service_detail: input.service_detail || null,
    district: input.district,
    pain_point: input.pain_point || null,
    urgency: input.urgency || null,
    photo_received: false,
    status: 'QUALIFYING',
    referral: {
      channel: 'web_landing',
      ...(input.referral || {}),
    },
    updated_at: new Date().toISOString(),
  };

  const rows = await request('leads?on_conflict=phone', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify([payload]),
  });

  const lead = rows?.[0];
  if (lead?.id) {
    await request('lead_events', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify([
        {
          lead_id: lead.id,
          event_type: 'WEB_FORM_SUBMITTED',
          payload: {
            service_type: input.service_type,
            service_detail: input.service_detail || null,
            district: input.district,
            pain_point: input.pain_point || null,
            urgency: input.urgency || null,
            referral: input.referral || {},
          },
        },
      ]),
    });
  }

  return lead;
}
