type ServiceCardProps = {
  title: string;
  description: string;
  icon: string;
};

export function ServiceCard({ title, description, icon }: ServiceCardProps) {
  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition duration-300 hover:border-[#1eb21e] hover:shadow-xl hover:-translate-y-1 sm:p-7">
      <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#1eb21e] text-3xl shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-base leading-6 text-slate-600">{description}</p>
      <div className="mt-4 inline-flex opacity-0 transition group-hover:opacity-100">
        <a className="inline-flex items-center justify-center rounded-full bg-white border-2 border-[#1eb21e] px-3 py-1 text-base font-medium text-black transition hover:bg-[#8f6641] hover:text-white">Learn more →</a>
      </div>
    </article>
  );
}

