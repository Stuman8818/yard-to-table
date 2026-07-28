import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { YardImporter } from "@/components/garden-planner/YardImporter";

export const metadata: Metadata = {
  title: "Garden Planner | Yard To Table",
  description: "Import a yard image to start planning your garden layout.",
};

export default function GardenPlannerPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="flex h-[100vh] pt-18">
        <aside className="hidden w-50 shrink-0 border-r border-white/10 bg-[#8f6641] p-6 text-white lg:block">
          <nav aria-label="Garden planner tools" className="flex h-full flex-col">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-white/70">
                Garden Planner
              </p>
              <h1 className="mt-3 text-2xl font-bold">Yard Layout</h1>
            </div>

            <div className="mt-8 space-y-2">
              <button
                type="button"
                className="w-full rounded-lg bg-white px-4 py-3 text-left text-sm font-semibold text-slate-950"
              >
                Import Yard
              </button>
              <button
                type="button"
                className="w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Garden Beds
              </button>
              <button
                type="button"
                className="w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Plants
              </button>
            </div>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <YardImporter />
        </div>
      </main>
    </div>
  );
}
