import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#173f32]/95 text-white backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-6 px-6 sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Yard To Table home">
          <Image
            src="/yard-to-table-logo.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 rounded-lg object-cover"
            priority
          />
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
