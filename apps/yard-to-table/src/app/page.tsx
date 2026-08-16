const services = [
  {
    title: "Lawn care",
    description: "Dependable mowing, trimming, edging, and cleanup tailored to the property.",
  },
  {
    title: "Garden consultation",
    description: "Practical guidance for making better use of sunny, shaded, and growing spaces.",
  },
  {
    title: "Garden design & installation",
    description: "Thoughtful plans and hands-on installation for productive, welcoming gardens.",
  },
  {
    title: "Seasonal maintenance",
    description: "Ongoing support that keeps lawns and gardens healthy as conditions change.",
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
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-8">
          <a
            href="#top"
            className="font-semibold tracking-[-0.02em]"
            aria-label="Yard To Table home"
          >
            Yard To Table
          </a>
          <nav
            aria-label="Primary navigation"
            className="flex gap-5 text-sm text-[#d7e2da] sm:gap-7"
          >
            <a href="#services" className="hover:text-white">
              Services
            </a>
            <a href="#approach" className="hover:text-white">
              Our approach
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
              href="#services"
              className="mt-9 inline-flex rounded-lg bg-[#e9efe5] px-5 py-3 font-semibold text-[#173f32] hover:bg-white"
            >
              Explore our services
            </a>
          </div>
        </section>

        <section id="services" className="scroll-mt-8 bg-[#edf2e9]">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#476654]">Services</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Practical help for the whole outdoor space.
            </h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="rounded-xl border border-[#d5ded2] bg-white p-7"
                >
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="mt-3 leading-7 text-[#607067]">{service.description}</p>
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
