import ContactForm from "@/components/home/ContactForm";

export function IntakeExperience({ embedded = false }: { embedded?: boolean }) {
  if (embedded) {
    return (
      <main className="min-h-screen bg-[#f3f5ef] p-3 text-[#1e2923] sm:p-6">
        <section
          aria-label="Customer service request"
          className="mx-auto max-w-3xl rounded-2xl border border-[#d9ded6] bg-white p-5 shadow-[0_16px_45px_rgba(32,59,49,0.08)] sm:p-8"
        >
          <ContactForm />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f5ef] px-3 py-6 text-[#1e2923] sm:px-6 sm:py-12">
      <section
        aria-label="Customer service request"
        className="mx-auto max-w-3xl rounded-2xl border border-[#d9ded6] bg-white p-5 shadow-[0_20px_60px_rgba(32,59,49,0.08)] sm:p-8"
      >
        <ContactForm />
      </section>
    </main>
  );
}
