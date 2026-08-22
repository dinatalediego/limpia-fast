'use client';

export type Attribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  landing_page?: string;
  referrer?: string;
};

const KEY = 'limpiafast_attribution_v1';

export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const current: Attribution = {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    content: params.get('utm_content') || undefined,
    term: params.get('utm_term') || undefined,
    landing_page: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || undefined,
  };

  let previous: Attribution = {};
  try {
    previous = JSON.parse(localStorage.getItem(KEY) || '{}') as Attribution;
  } catch {
    previous = {};
  }

  const merged = {
    ...previous,
    ...Object.fromEntries(Object.entries(current).filter(([, value]) => value)),
  };

  try {
    localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {
    // Attribution persistence is best-effort.
  }
  return merged;
}

export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') as Attribution;
  } catch {
    return {};
  }
}
