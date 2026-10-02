import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Subtle Gradient Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl" />
      <div className="pointer-events-none absolute top-20 -right-40 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Fulfilment Reliability Platform</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-bold">Hackathon Functional MVP</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            NOVA{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              ASSURE
            </span>
          </h1>

          {/* Tagline */}
          <p className="mt-4 text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
            Making local commerce more reliable.
          </p>

          {/* Required Short Description */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            NOVA ASSURE helps NOVA CART predict fulfilment risks, improve inventory reliability, and prevent avoidable order failures.
          </p>

          {/* Quick Action Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/customer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 transition-all hover:scale-105"
            >
              <span>Try Interactive Customer Flow</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/operations-center"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all hover:scale-105"
            >
              <span>View Operations Dashboard</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25l2.25 2.25 4.5-4.5" />
              </svg>
            </Link>
          </div>
        </div>

        {/* The Three Portal Cards / Buttons */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* 1. Customer */}
          <div className="group relative bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500 rounded-t-2xl" />
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.0 0 3.75 3.75 0 0 1 7.0 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Customer
              </h2>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Search everyday Indian groceries, compare nearby store confidence scores, and simulate instant inventory stockout failover.
              </p>
            </div>
            <div className="mt-7">
              <Link
                href="/customer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 transition-all"
              >
                <span>Enter Customer Portal</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* 2. Store Manager */}
          <div className="group relative bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600 rounded-t-2xl" />
            <div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.25A2.25 2.25 0 0 1 0 18.75V10.5M18 21h3.75A2.25 2.25 0 0 0 24 18.75V10.5M7.5 21v-4.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75V21m-3 0h3M3.75 9h16.5m-16.5 0a2.25 2.25 0 0 1-2.25-2.25V4.5A2.25 2.25 0 0 1 3.75 2.25h16.5A2.25 2.25 0 0 1 22.5 4.5v2.25A2.25 2.25 0 0 1 20.25 9m-16.5 0L2 19m20-10-1.75 10" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Store Manager
              </h2>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Reconcile physical dark-store shelf counts with digital catalog listings to eliminate ghost inventory traps.
              </p>
            </div>
            <div className="mt-7">
              <Link
                href="/store-manager"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 transition-all"
              >
                <span>Enter Store Manager</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* 3. Operations Center */}
          <div className="group relative bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-t-2xl" />
            <div>
              <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25l2.25 2.25 4.5-4.5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Operations Center
              </h2>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Monitor system-wide at-risk orders, track top risk drivers, and trigger automated failovers before order dropoff.
              </p>
            </div>
            <div className="mt-7">
              <Link
                href="/operations-center"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
              >
                <span>Enter Operations</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* CRITICAL SECTION: "Why NOVA ASSURE?" */}
        <div className="mt-20 max-w-5xl mx-auto rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              The Strategic Diagnosis
            </span>
            <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Why NOVA ASSURE?
            </h2>
            <p className="mt-3 text-lg font-semibold text-slate-700">
              NOVA CART does not primarily have a demand problem; it has a fulfilment reliability problem.
            </p>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Customers want quick commerce, but silent inventory mismatches and partner store stockouts destroy trust at the worst possible moment—after the user has already decided to buy.
            </p>
          </div>

          {/* The Data Proof Grid */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Repeat Purchase</div>
              <div className="text-2xl font-black text-rose-600 mt-1">41% ➔ 27%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Heavy retention loss</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Cancellation Rate</div>
              <div className="text-2xl font-black text-rose-600 mt-1">6% ➔ 11%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Nearly doubled</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Root Cause</div>
              <div className="text-2xl font-black text-rose-600 mt-1">35%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Product unavailability</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Delivery Latency</div>
              <div className="text-2xl font-black text-amber-600 mt-1">29 ➔ 37 min</div>
              <div className="text-[11px] text-slate-400 mt-0.5">SLA breaches increasing</div>
            </div>
          </div>

          {/* How NOVA ASSURE Solves It */}
          <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Pre-Checkout Confidence Scoring</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculates transparent 5-factor confidence (35% inventory, 25% acceptance, 20% delivery, 10% ETA, 10% substitution) before payment.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Proactive Inventory Failover</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Detects ghost inventory immediately and recommends verified nearby backup stores with zero order dropoff.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Centralized Network Operations</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gives operations teams real-time visibility into high-risk store clusters and automated batch re-routing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Required Prototype Disclaimer at the bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center text-xs text-slate-400">
        Prototype — scores are based on simulated data.
      </div>
    </div>
  );
}
