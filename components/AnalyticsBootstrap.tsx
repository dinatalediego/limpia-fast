'use client';

import { useEffect, useRef } from 'react';
import { captureAttribution } from '@/lib/utm';
import { trackEvent } from '@/lib/analytics';

const DEPTHS = [25, 50, 75, 90];

export default function AnalyticsBootstrap() {
  const fired = useRef(new Set<number>());

  useEffect(() => {
    const attribution = captureAttribution();
    trackEvent('page_view', {
      source: attribution.source,
      medium: attribution.medium,
      campaign: attribution.campaign,
      landing_page: attribution.landing_page,
    });

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const depth = Math.round((window.scrollY / max) * 100);
      for (const milestone of DEPTHS) {
        if (depth >= milestone && !fired.current.has(milestone)) {
          fired.current.add(milestone);
          trackEvent('scroll_depth', { percent: milestone });
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
