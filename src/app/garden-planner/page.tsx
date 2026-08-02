import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { YardImporter } from "@/components/garden-planner/YardImporter";

export const metadata: Metadata = {
  title: "Garden Planner | Yard To Table",
  description: "Import a yard image to start planning your garden layout.",
};

export default function GardenPlannerPage() {
  return (
    <div className="min-h-screen bg-[#f6f4ed]">
      <Header />
      <main className="flex h-screen pt-20">
        <aside className="hidden w-64 shrink-0 border-r border-[#d8ded6] bg-[#edf1e9] p-6 text-[#20372c] lg:block">
          <nav aria-label="Garden planner tools" className="flex h-full flex-col">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#607266]">
                Product prototype
              </p>
              <h1 className="mt-3 text-2xl font-bold">Yard Layout</h1>
            </div>

            <div className="mt-8 space-y-2">
              <button
                type="button"
                className="w-full rounded-lg bg-[#214d3c] px-4 py-3 text-left text-sm font-semibold text-white"
              >
                Import Yard
              </button>
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-lg px-4 py-3 text-left text-sm font-semibold text-[#78867d]"
              >
                Garden Beds <span className="ml-1 text-xs font-normal">— Coming soon</span>
              </button>
              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-lg px-4 py-3 text-left text-sm font-semibold text-[#78867d]"
              >
                Plants <span className="ml-1 text-xs font-normal">— Coming soon</span>
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
