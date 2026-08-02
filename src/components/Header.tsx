import Link from "next/link";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#173f32]/95 text-white backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-6 px-6 sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Yard To Table home">
          <BrandMark />
          <div>
            <p className="font-semibold tracking-[-0.02em]">Yard To Table</p>
            <p className="hidden text-xs text-[#adc4b3] sm:block">
              Lawn & garden services · Pre-launch
            </p>
          </div>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 text-sm text-[#d1ddd4] md:flex"
        >
          <Link href="/#how-it-works" className="transition-colors hover:text-white">
            How It Works
          </Link>
          <Link href="/#services" className="transition-colors hover:text-white">
            Services
          </Link>
          <Link href="/#platform" className="transition-colors hover:text-white">
            The Platform
          </Link>
          <Link href="/#roadmap" className="transition-colors hover:text-white">
            Roadmap
          </Link>
        </nav>

        <Link
          href="/#interest"
          className="inline-flex items-center justify-center rounded-lg bg-[#e8eee5] px-4 py-2.5 text-sm font-semibold text-[#173f32] transition-colors hover:bg-white"
        >
          Join Early Interest
        </Link>
      </div>
    </header>
  );
}

function BrandMark() {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-[#dcebdc]">
      <svg
        role="img"
        aria-label="Yard To Table brand mark"
        viewBox="0 0 32 32"
        className="h-7 w-7 fill-none stroke-current stroke-[1.8]"
      >
        <path d="M6 18.5 16 23l10-4.5L16 14 6 18.5Z" />
        <path d="M6 18.5v5L16 28l10-4.5v-5M16 23v5" />
        <path d="M16 14V8.5m0 1.5c-4.5 0-6.5-2.2-6.5-5.5 4.2 0 6.5 2 6.5 5.5Zm0-1.5c0-3.3 2.2-5.5 6.5-5.5 0 3.3-2.1 5.5-6.5 5.5Z" />
      </svg>
    </span>
  );
}
