"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export function YardImporter() {
  const [yardImage, setYardImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (yardImage) {
        URL.revokeObjectURL(yardImage);
      }
    };
  }, [yardImage]);

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const nextImage = URL.createObjectURL(file);

    setYardImage((currentImage) => {
      if (currentImage) {
        URL.revokeObjectURL(currentImage);
      }

      return nextImage;
    });
  }

  return (
    <section className="relative flex h-full min-h-0 w-full bg-[#1b2922]">
      {yardImage ? (
        <Image
          src={yardImage}
          alt="Imported yard"
          fill
          sizes="(min-width: 1024px) calc(100vw - 18rem), 100vw"
          className="object-contain"
          unoptimized
        />
      ) : (
        <div className="flex w-full items-center justify-center px-6">
          <div className="max-w-lg rounded-2xl border border-white/15 bg-white/5 p-8 text-center text-white shadow-2xl sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a8c2ad]">
              Interactive prototype
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">
              Start with your space
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#bdcbc1]">
              Import a yard photo to preview the first step of the garden-planning workflow. Your
              image stays in this browser session.
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-7 rounded-lg bg-[#e8eee5] px-6 py-3 font-semibold text-[#173f32] transition hover:bg-white focus:ring-4 focus:ring-white/30 focus:outline-none"
            >
              Import a yard image
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImport}
        className="sr-only"
        aria-label="Import a yard image"
      />
    </section>
  );
}
