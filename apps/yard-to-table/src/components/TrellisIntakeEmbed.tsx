"use client";

import { useEffect, useRef, useState } from "react";

const defaultTrellisUrl = "https://trellis-software.vercel.app";

export function TrellisIntakeEmbed() {
  const trellisUrl = (process.env.NEXT_PUBLIC_TRELLIS_URL ?? defaultTrellisUrl).replace(/\/$/, "");
  const intakeUrl = `${trellisUrl}/embed/intake`;
  const trellisOrigin = new URL(intakeUrl).origin;
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState(1450);

  useEffect(() => {
    const receiveHeight = (event: MessageEvent) => {
      if (
        event.origin !== trellisOrigin ||
        event.source !== frameRef.current?.contentWindow ||
        !event.data ||
        event.data.type !== "trellis:intake-resize" ||
        typeof event.data.height !== "number"
      ) {
        return;
      }

      setFrameHeight(Math.min(Math.max(Math.ceil(event.data.height), 800), 4000));
    };

    window.addEventListener("message", receiveHeight);
    return () => window.removeEventListener("message", receiveHeight);
  }, [trellisOrigin]);

  return (
    <iframe
      ref={frameRef}
      src={intakeUrl}
      title="Request Yard To Table landscaping service"
      style={{ height: frameHeight }}
      className="w-full rounded-2xl border border-[#d5ded2] bg-[#f3f5ef] shadow-[0_20px_60px_rgba(32,59,49,0.09)]"
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox="allow-forms allow-same-origin allow-scripts"
    />
  );
}
