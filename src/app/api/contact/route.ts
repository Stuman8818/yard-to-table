/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, address, email, message } = body;

    if (!name || !phone || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const toAddress = process.env.CONTACT_RECIPIENT || 'dave.stewart.8823@gmail.com';
    const fromAddress = process.env.FROM_ADDRESS || 'Yard To Table <onboarding@resend.dev>';

    if (!resend) {
      return NextResponse.json(
        { error: 'Email provider is not configured. Set RESEND_API_KEY.' },
        { status: 503 },
      );
    }

    const result = await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      replyTo: email,
      subject: `New contact request from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nAddress: ${address || 'N/A'}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Address:</strong> ${address || 'N/A'}</p>
             <p><strong>Email:</strong> ${email}</p>
             <hr/>
             <p>${message}</p>`,
    });

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (err: any) {
    console.error('Contact form submission failed', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
