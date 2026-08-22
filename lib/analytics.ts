'use client';

import { track as vercelTrack } from '@vercel/analytics';

type EventValue = string | number | boolean | null | undefined;
type EventPayload = Record<string, EventValue>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, payload: EventPayload = {}) {
  const clean = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null)
  ) as Record<string, string | number | boolean>;

  try {
    vercelTrack(name, clean);
  } catch {
    // Analytics must never block conversion UX.
  }

  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...clean });
  window.gtag?.('event', name, clean);
  window.fbq?.('trackCustom', name, clean);
}
