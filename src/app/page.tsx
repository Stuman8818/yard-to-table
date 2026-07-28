import { BenefitCard } from "@/components/home/BenefitCard";
import { ServiceCard } from "@/components/home/ServiceCard";
import ContactForm from "@/components/home/ContactForm";
import { Header } from "@/components/Header";
import Image from "next/image";

const services = [
  {
    title: "Lawn mowing",
    description:
      "Keep your grass tidy with reliable mowing that leaves a clean, even finish and healthy curb appeal.",
    icon: "🌱",
  },
  {
    title: "Weed eating & trimming",
    description:
      "Trim edges and clear hard-to-reach spots around beds, fences, and walkways for a polished yard.",
    icon: "✂️",
  },
  {
    title: "Driveway, sidewalk, patio blow-off",
    description:
      "Remove grass clippings, leaves, and debris for cleaner outdoor surfaces and a refreshed property.",
    icon: "🍂",
  },
];

const benefits = [
  {
    title: "Local and reliable",
    description:
      "A neighbor-owned service built for nearby homeowners who want a simple, honest experience.",
  },
  {
    title: "Simple, straightforward service",
    description:
      "Focused on lawn care with a friendly, practical approach—no hidden fees or upselling.",
  },
  {
    title: "Clean curb appeal",
    description:
      "Well-kept grass, edges, and outdoor surfaces that make your home feel well-maintained.",
  },
  {
    title: "Trustworthy and consistent",
    description: "Dependable service for homeowners who value reliability and a personal touch.",
  },
];

const gardenPlanningFeatures = [
  "Garden bed and raised bed design for your yard size.",
  "Layout ideas for vegetables, herbs, flowers, and small-space growing.",
  "Guidance on grow bags, trellises, and vertical growing options.",
  "Plant recommendations matched to your local growing season.",
];

const futureFeatures = [
  "Step-by-step garden care instructions updated seasonally.",
  "Resource library for maintenance, watering, and troubleshooting.",
  "Helpful tips for small yards, containers, and compact spaces.",
  "Tools to track your garden and plan next season.",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-32 sm:px-8">
        {/* Hero Section with Illustration Background */}
        <section
          className="relative overflow-hidden rounded-2xl px-8 py-16 shadow-xl sm:px-12 sm:py-24"
          style={{ backgroundColor: "#1eb21e" }}
        >
          {/* Decorative background elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div
            className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full blur-3xl"
            style={{ backgroundColor: "rgba(0,239,109,0.12)" }}
          ></div>

          <div className="relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                <p className="text-base font-semibold text-white">Lawn Care Made Simple</p>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Keep Your Yard Looking Great
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white">
                Professional local lawn mowing, trimming, and cleanup service. We handle the hard
                work so you can enjoy your outdoor space.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full bg-white border-2 border-[#1eb21e] px-8 py-3 text-base font-semibold text-black shadow-lg transition hover:bg-[#8f6641] hover:text-white"
                >
                  Request Service
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center rounded-full bg-white border-2 border-[#1eb21e] px-8 py-3 text-base font-semibold text-black transition hover:bg-[#8f6641] hover:text-white"
                >
                  See Services
                </a>
              </div>
            </div>

            {/* Illustration replaced with site logo */}
            <div className="relative h-80 rounded-2xl bg-white/10 p-8 shadow-2xl sm:h-96">
              <Image
                src="/yard-to-table-logo.png"
                alt="Yard To Table Logo"
                width={320}
                height={320}
                className="mx-auto h-full w-auto object-contain"
              />
            </div>
          </div>
        </section>

        <section id="services" className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-base font-bold uppercase tracking-widest text-[#1eb21e]">
              Current Services
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
              Complete Lawn Care Solutions
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Professional service that keeps your yard looking its best, week after week.
            </p>
          </div>
          <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-3 mx-auto max-w-5xl">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </section>

        <section
          id="why"
          className="mt-20 rounded-2xl p-8 shadow-lg sm:p-12"
          style={{ backgroundColor: "#8f6641" }}
        >
          <div className="mx-auto max-w-4xl">
            <p className="text-base font-bold uppercase tracking-widest text-white">
              Why Choose Us
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              A local lawn care service you can trust
            </h2>
            <p className="mt-6 text-lg text-white/90">
              We&apos;re built for homeowners who want dependable service, beautiful outdoor spaces,
              and a partner who genuinely cares about the details.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <BenefitCard key={benefit.title} {...benefit} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="garden-planning"
          className="mt-20 rounded-2xl p-8 shadow-lg sm:p-12"
          style={{ backgroundColor: "#8f6641" }}
        >
          <div className="mx-auto max-w-4xl">
            <p className="text-base font-bold uppercase tracking-widest text-white">
              Coming Next Year
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Garden planning & installation service
            </h2>
            <p className="mt-6 text-lg text-white/90">
              Next year, Yard To Table is expanding to help you design and install a garden that
              fits your yard perfectly. We&apos;ll work with garden beds, raised beds, grow bags,
              trellises, and vertical growing to maximize your space.
            </p>
            <div className="mt-12">
              <p className="mb-8 text-base font-bold uppercase tracking-widest text-white">
                Planning service includes:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {gardenPlanningFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex gap-3">
                      <div className="mt-1 text-white text-xl">→</div>
                      <p className="text-base leading-6 text-slate-700">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="mt-20 rounded-2xl p-8 shadow-lg sm:p-12"
          style={{ backgroundColor: "#8f6641" }}
        >
          <div className="mx-auto max-w-4xl">
            <p className="text-base font-bold uppercase tracking-widest text-white">
              Future Website Features
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Garden care resources & insights
            </h2>
            <p className="mt-6 text-lg text-white/90">
              Down the road, this site will become a helpful resource for garden care throughout the
              season. We may also explore subscription options for ongoing maintenance.
            </p>
            <div className="mt-12">
              <p className="mb-8 text-base font-bold uppercase tracking-widest text-white">
                Planned features:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {futureFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex gap-3">
                      <div className="mt-1 text-white text-xl">✓</div>
                      <p className="text-base leading-6 text-slate-700">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="service-area"
          className="mt-16 rounded-[2rem] border p-8 shadow-lg sm:p-10"
          style={{ backgroundColor: "#8f6641", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr] sm:items-center">
            <div>
              <p className="text-base font-semibold uppercase tracking-[0.25em] text-white">
                Service Area
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Currently Servicing North Noblesville
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/90">
                Currently servicing North Noblesville and nearby neighborhoods.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 text-base text-white shadow-sm">
              <p className="font-semibold text-white">Currently servicing North Noblesville.</p>
              <p className="mt-3 leading-7">
                Perfect for homeowners who want friendly local service without the corporate feel.
              </p>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="mt-20 rounded-2xl border p-8 shadow-lg sm:p-12"
          style={{ backgroundColor: "#8f6641", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-base font-semibold uppercase tracking-widest text-white">Contact</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Ready to request lawn service?
            </h2>
            <p className="mt-6 text-lg font-semibold text-white">
              Reach out with a quick call, text, or email today, and we&apos;ll follow up with
              details and availability.
            </p>
            <div className="mt-10">
              <div className="rounded-xl bg-[#8f6641] p-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ backgroundColor: "#8f6641" }} className="py-12 shadow-inner">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-lg font-bold text-white">Yard To Table</p>
              <p className="mt-3 max-w-md text-base leading-6 text-white/90">
                Local lawn care today. Garden planning coming next year. Professional service,
                friendly approach.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:items-end">
              <div className="flex flex-wrap gap-6 text-base font-medium">
                <a href="#services" className="text-white transition hover:text-[#1eb21e]">
                  Services
                </a>
                <a href="#why" className="text-white transition hover:text-[#1eb21e]">
                  Why Us
                </a>
                <a href="#garden-planning" className="text-white transition hover:text-[#1eb21e]">
                  Garden Planning
                </a>
                <a href="#contact" className="text-white transition hover:text-[#1eb21e]">
                  Contact
                </a>
              </div>
              <p className="text-xs text-white/80">© 2026 Yard To Table. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
