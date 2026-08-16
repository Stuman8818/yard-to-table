import ContactForm from "@/components/home/ContactForm";

export default function IntakePage() {
  return (
    <main className="min-h-screen bg-[#f3f5ef] px-6 py-12 text-[#1e2923] sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <section className="pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#53705e]">Trellis</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Tell us about your property.
          </h1>
          <p className="mt-5 max-w-md leading-7 text-[#5b6860]">
            Share your contact details, property address, and the landscaping services you are
            interested in. Your request enters the Trellis service workflow for follow-up.
          </p>
          <div className="mt-8 rounded-xl border border-[#ced8cc] bg-[#e6ece2] p-5 text-sm leading-6 text-[#526158]">
            Submitting this form does not schedule or purchase a service. A Yard To Table team
            member will contact you about availability and next steps.
          </div>
        </section>

        <section
          aria-label="Customer service request"
          className="rounded-2xl border border-[#d9ded6] bg-white p-5 shadow-[0_20px_60px_rgba(32,59,49,0.08)] sm:p-8"
        >
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
