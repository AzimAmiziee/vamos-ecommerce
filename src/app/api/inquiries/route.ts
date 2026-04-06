import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, name, email, company, subject, message } = body;

  if (!type || !['contact', 'partnership'].includes(type)) {
    return NextResponse.json({ error: 'invalid_type' }, { status: 400 });
  }
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }
  if (!email.includes('@')) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from('contact_inquiries').insert({
    type,
    name:    name.trim(),
    email:   email.trim().toLowerCase(),
    company: company?.trim() || null,
    subject: subject?.trim() || null,
    message: message.trim(),
  });

  if (error) {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
