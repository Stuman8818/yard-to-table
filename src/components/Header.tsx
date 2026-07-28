import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 h-18 shadow-md"
      style={{ backgroundColor: '#1eb21e' }}
    >
      <div className="mx-auto h-full max-w-7xl px-6 sm:px-8">
        <div className="flex h-full items-center justify-between gap-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/yard-to-table-logo.png"
              alt="Yard To Table Logo"
              width={64}
              height={64}
              className="rounded-2xl shadow-sm"
              priority
            />
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-wider text-white uppercase">Yard To Table</p>
              <p className="hidden text-base font-semibold text-white sm:block">
                Local Lawn Care & Garden Installation
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/garden-planner"
              className="text-base font-medium text-white transition hover:text-white"
            >
              Garden Planner
            </Link>
            <Link
              href="/#services"
              className="text-base font-medium text-white transition hover:text-white"
            >
              Services
            </Link>
            <Link
              href="/#why"
              className="text-base font-medium text-white transition hover:text-white"
            >
              Why Choose Us
            </Link>
          </nav>
          <Link
            href="/#contact"
            className="inline-flex rounded-full border-2 border-[#1eb21e] bg-white px-5 py-2 text-base font-semibold text-black transition hover:bg-[#8f6641] hover:text-white sm:px-6 sm:py-2.5"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}
