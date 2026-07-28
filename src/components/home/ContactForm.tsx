/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg?: string; previewUrl?: string }>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address, email, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ ok: true, msg: 'Message sent — thank you!', previewUrl: data.previewUrl });
        setName(''); setPhone(''); setAddress(''); setEmail(''); setMessage('');
      } else {
        setStatus({ ok: false, msg: data.error || 'Failed to send message' });
      }
    } catch (err: any) {
      setStatus({ ok: false, msg: err?.message || 'Network error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto bg-[#8f6641] max-w-2xl text-left text-white font-semibold">
      <div className="grid gap-4 sm:grid-cols-2 bg-[#8f6641]">
        <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="text-white font-semibold w-full rounded-md border px-3 py-2" />
        <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className="text-white font-semibold w-full rounded-md border px-3 py-2" />
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address (optional)" className="text-white font-semibold w-full rounded-md border px-3 py-2 sm:col-span-2" />
        <input required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="text-white font-semibold w-full rounded-md border px-3 py-2 sm:col-span-2" />
        <textarea required value={message} onChange={e => setMessage(e.target.value)} placeholder="Brief note about the service you want" className="text-white font-semibold w-full rounded-md border px-3 py-2 sm:col-span-2" rows={5} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-full bg-white border-2 border-[#1eb21e] px-6 py-2 text-base font-semibold text-black transition hover:bg-[#8f6641] hover:text-white">
          {loading ? 'Sending...' : 'Send Request'}
        </button>
        {status && (
          <div className={`text-sm ${status.ok ? 'text-green-600' : 'text-red-600'}`}>
            {status.msg}
            {status.previewUrl && (
              <div className="mt-2">
                <a href={status.previewUrl} target="_blank" rel="noreferrer" className="underline">View email preview</a>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
