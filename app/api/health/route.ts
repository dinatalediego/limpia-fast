import { NextResponse } from 'next/server';
import { storageConfigured } from '@/lib/supabase';

export function GET() {
  return NextResponse.json({ ok: true, app: 'limpia-fast', storage: storageConfigured() ? 'supabase' : 'not_configured' });
}
