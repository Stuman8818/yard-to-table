type BenefitCardProps = {
  title: string;
  description: string;
};

export function BenefitCard({ title, description }: BenefitCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md transition hover:shadow-lg hover:border-[#1eb21e]">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#1eb21e] text-[#8f6641] font-bold text-lg">
        ✓
      </div>
      <p className="text-base font-bold text-slate-950">{title}</p>
      <p className="mt-2 text-base leading-6 text-slate-600">{description}</p>
    </div>
  );
}
