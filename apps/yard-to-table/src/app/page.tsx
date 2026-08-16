import Image from "next/image";

import { TrellisIntakeEmbed } from "../components/TrellisIntakeEmbed";

const services = [
  {
    title: "Lawn maintenance",
    description: "Consistent care that keeps lawns and the edges around them looking finished.",
    items: ["Weekly mowing", "String trimming", "Edging", "Blowing", "Hedge trimming"],
  },
  {
    title: "Landscape maintenance",
    description: "Seasonal upkeep for planting beds, shrubs, and established landscapes.",
    items: [
      "Mulch installation",
      "Bed edging",
      "Weeding",
      "Shrub trimming",
      "Spring cleanup",
      "Fall cleanup",
      "Plant replacement",
    ],
  },
  {
    title: "Landscape installation",
    description: "New planting areas and materials that add structure, color, and curb appeal.",
    items: [
      "New landscape beds",
      "Bed expansion",
      "Flowers and perennials",
      "Shrubs",
      "Small ornamental plants",
      "Rock installation",
      "Mulch installation",
    ],
  },
  {
    title: "Garden installation",
    description: "Practical growing spaces planned and prepared around the property and season.",
    items: [
      "Vegetable garden installation",
      "Raised garden beds",
      "Garden layout and design",
      "Soil preparation",
      "Planting",
      "Seasonal garden setup",
    ],
  },
  {
    title: "Property improvement & refresh",
    description:
      "Focused improvements that help tired or overgrown outdoor spaces feel cared for again.",
    items: [
      "Existing bed renovation",
      "Overgrown landscape cleanup",
      "Replacing dead or outdated plants",
      "Refreshing mulch or rock",
      "Improving curb appeal",
    ],
  },
] as const;

const values = [
  "Recommendations grounded in the actual property",
  "Clear scopes and practical next steps",
  "One team across lawn, garden, and seasonal care",
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f4ed] text-[#1e2923]">
      <header className="border-b border-white/15 bg-[#173f32] text-white">
        <div className="mx-auto flex min-h-24 max-w-6xl items-center justify-between gap-5 px-6 py-3 sm:px-8">
          <a
            href="#top"
            className="flex shrink-0 items-center gap-3"
            aria-label="Yard To Table home"
          >
            <Image
              src="/Yard to Table Logo.png"
              alt=""
              width={64}
              height={64}
              priority
              className="h-14 w-14 rounded-xl bg-[#f8f5ec] object-contain p-1 shadow-sm"
            />
            <span>
              <span className="block font-semibold tracking-[-0.02em]">Yard To Table</span>
              <span className="hidden text-xs text-[#adc4b3] sm:block">Landscaping</span>
            </span>
          </a>
          <nav
            aria-label="Primary navigation"
            className="flex gap-4 text-xs text-[#d7e2da] sm:gap-7 sm:text-sm"
          >
            <a href="#services" className="hover:text-white">
              Services
            </a>
            <a href="#approach" className="hidden hover:text-white md:inline">
              Our approach
            </a>
            <a href="#request-service" className="hover:text-white">
              Request service
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="bg-[#173f32] text-white">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b9d4bd]">
              Lawn care & garden services
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-7xl">
              Better care for the yard you have—and the garden you want.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d5e1d9]">
              Yard To Table helps Indiana homeowners care for their lawns, plan useful garden
              spaces, and make thoughtful improvements to the whole property.
            </p>
            <a
              href="#request-service"
              className="mt-9 inline-flex rounded-lg bg-[#e9efe5] px-5 py-3 font-semibold text-[#173f32] hover:bg-white"
            >
              Request service
            </a>
          </div>
        </section>

        <section id="services" className="scroll-mt-8 bg-[#edf2e9]">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#476654]">Services</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Practical help for the whole outdoor space.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-[#59665e]">
              From weekly lawn maintenance to garden installations and complete landscape refreshes,
              choose the level of help that fits your property.
            </p>
            <div className="mt-12 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="rounded-xl border border-[#d5ded2] bg-white p-7 shadow-[0_10px_30px_rgba(32,59,49,0.04)]"
                >
                  <div className="mb-6 h-1 w-10 rounded-full bg-[#78957e]" aria-hidden="true" />
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#607067]">{service.description}</p>
                  <ul className="mt-6 space-y-2.5 border-t border-[#e2e7df] pt-5 text-sm text-[#405247]">
                    {service.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#78957e]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="approach" className="scroll-mt-8 bg-[#fbfaf6]">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:px-8 sm:py-28 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#476654]">
                Our approach
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Start with the property. Build from there.
              </h2>
              <p className="mt-6 leading-7 text-[#59665e]">
                Good landscaping work begins with listening: how the yard is used, what is thriving,
                what is difficult to maintain, and what the homeowner wants to grow next.
              </p>
            </div>
            <ul className="space-y-4">
              {values.map((value) => (
                <li
                  key={value}
                  className="border-t border-[#d8dfd5] pt-4 text-lg font-medium text-[#33473b]"
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="request-service" className="scroll-mt-8 bg-[#e8eee5]">
          <div className="mx-auto max-w-6xl px-3 py-20 sm:px-8 sm:py-28">
            <div className="px-3 sm:px-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#476654]">
                Request service
              </p>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Tell us what your property needs.
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-[#59665e]">
                This secure request form is provided by Trellis, our field-service platform. Your
                information goes directly into our service workflow for follow-up.
              </p>
            </div>
            <div className="mt-10">
              <TrellisIntakeEmbed />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d8ddd5] bg-[#eef0e9]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm sm:px-8">
          <p className="font-semibold">Yard To Table Landscaping</p>
          <p className="text-[#647068]">Thoughtful lawn and garden care for Indiana homeowners.</p>
          <p className="mt-4 text-xs text-[#79837d]">© 2026 Yard To Table. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
