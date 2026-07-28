'use client';

import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

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
    <section className="relative flex h-full min-h-0 w-full bg-slate-950">
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
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-[#1eb21e] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-[#168a16] focus:ring-4 focus:ring-white/70 focus:outline-none"
          >
            Import Yard
          </button>
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
