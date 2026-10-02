"use client";

import { useState } from "react";
import Link from "next/link";
import { INITIAL_RISKY_STORES, INITIAL_PROTECTED_ORDERS } from "@/data/mockData";
import { RiskyStoreMetric, ProtectedOrder } from "@/types";

interface OperationsInsight {
  headline: string;
  mainRisk: string;
  mainRiskDetail: string;
  evidenceHeadline: string;
  evidence: string;
  actionHeadline: string;
  recommendedAction: string;
  timestamp: string;
}

function calculateInsight(currentStores: RiskyStoreMetric[], atRisk: number): OperationsInsight {
  const swastik = currentStores.find((s) => s.id === "store-swastik");
  const krishna = currentStores.find((s) => s.id === "store-krishna");
  const sriLaxmi = currentStores.find((s) => s.id === "store-sri-laxmi");

  // Condition 1: Inventory issue at Swastik still active
  if (swastik && swastik.status !== "Auto-Rerouted" && swastik.shelfAuditStatus !== "Up to Date") {
    return {
      headline:
        "Inventory-related issues are currently the largest preventable fulfilment risk. Prioritize stores with stale inventory updates and high order volume.",
      mainRisk: "Ghost Inventory & Stale Dark-Store Sync (35% Root Cause)",
      mainRiskDetail:
        "Physical shelves have depleted while digital catalog promises availability, setting up checkout failure traps.",
      evidenceHeadline: `${swastik.name} (${swastik.cancellationRate} cancellations)`,
      evidence: `Shelf audit is overdue (>4h) with Critical Discrepancy. ${swastik.activeOrders} orders currently at risk at this location, driving ${atRisk} at-risk orders network-wide.`,
      actionHeadline: "Dispatch Priority Barcode Audit & Throttle Low-Stock SKUs",
      recommendedAction:
        "Trigger handheld terminal audit for dairy & staples immediately. Auto-reroute pending checkouts to Domlur backup hub to prevent cancellation.",
      timestamp: "Just now",
    };
  }

  // Condition 2: Swastik audited or rerouted, but Krishna has acceptance lag
  if (krishna && krishna.status !== "Auto-Rerouted") {
    return {
      headline:
        "Merchant acceptance latency is now the dominant bottleneck. Accelerate merchant acknowledgment before order timeout triggers.",
      mainRisk: "Store Merchant Acceptance Latency > 5 mins (25% Root Cause)",
      mainRiskDetail:
        "Partner store staff are busy with offline counter walk-ins, causing dispatch queue stagnation.",
      evidenceHeadline: `${krishna.name} (${krishna.activeOrders} orders pending)`,
      evidence: `Average response latency has drifted to 5.2 mins vs. target 45s SLA. Cancellation risk elevated to 13.2%.`,
      actionHeadline: "Engage Automated Escalation Alarm & Pre-dispatch Riders",
      recommendedAction:
        "Trigger audible alert on merchant tablet and dispatch riders 4 minutes early to assist with order staging.",
      timestamp: "Just now",
    };
  }

  // Condition 3: Sri Laxmi rider density choke
  if (sriLaxmi && sriLaxmi.status !== "Auto-Rerouted") {
    return {
      headline:
        "Hyperlocal rider density deficit in southeastern cluster. Batch outbound orders to protect 30-min SLA.",
      mainRisk: "Rider Supply Choke & Corridor Congestion (20% Root Cause)",
      mainRiskDetail:
        "Demand spikes in Ejipura corridor are outstripping active courier supply, causing ETA drift from 29 to 37+ mins.",
      evidenceHeadline: `${sriLaxmi.name} (${sriLaxmi.activeOrders} queued orders)`,
      evidence: `Cancellation rate at 11.8% driven by transit delays and rider wait time exceeding 12 mins at pickup dock.`,
      actionHeadline: "Activate Surge Multi-Drop Batching & Cross-Zone Routing",
      recommendedAction:
        "Enable 2-order batching for nearby drops within 1.5 km and reroute new orders to Apollo Quick Mart.",
      timestamp: "Just now",
    };
  }

  // Condition 4: All stores addressed or stabilized
  return {
    headline:
      "Network fulfilment risks have been mitigated. Fulfilment reliability index is operating at 94% optimal health.",
    mainRisk: "Zero Critical Bottlenecks (Preventative Mode Active)",
    mainRiskDetail:
      "All high-risk partner store anomalies have been addressed via priority audits or automated fallback routing.",
    evidenceHeadline: `0 At-Risk Stores • 142+ Shielded Orders`,
    evidence: `Network cancellation rate successfully reduced from 11% baseline to below 2.5%. Zero active shelf discrepancies reported.`,
    actionHeadline: "Maintain Automated Telemetry Polling",
    recommendedAction:
      "Continue monitoring 15-minute sync heartbeat across dark stores and dark store replenishments.",
    timestamp: "Just now",
  };
}

export default function OperationsCenterPage() {
  const [stores, setStores] = useState<RiskyStoreMetric[]>(INITIAL_RISKY_STORES);
  const [protectedOrders, setProtectedOrders] = useState<ProtectedOrder[]>(INITIAL_PROTECTED_ORDERS);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  // Derived Operations Metrics
  const totalOrders = 1482;
  const atRiskCount = stores.reduce(
    (acc, s) => acc + (s.status === "Auto-Rerouted" ? 0 : s.activeOrders),
    0
  );
  const predictedCancellations = Math.round(atRiskCount * 0.54);
  const protectedOrdersCount = protectedOrders.length * 36; // Scaled for demo impact

  // Operations Insight State
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<OperationsInsight>(() =>
    calculateInsight(INITIAL_RISKY_STORES, 164)
  );

  const handleGenerateInsight = () => {
    setIsGeneratingInsight(true);
    setTimeout(() => {
      const updated = calculateInsight(stores, atRiskCount);
      setCurrentInsight({
        ...updated,
        timestamp: "Updated just now",
      });
      setIsGeneratingInsight(false);
    }, 280);
  };

  // Business Impact Scenario Calculator State
  // Case Data: Monthly Orders: 38,500 | Cancellation Rate: 11% | AOV: ₹486
  const [reductionPercent, setReductionPercent] = useState<number>(15);
  const monthlyOrders = 38500;
  const baseCancellationRate = 0.11;
  const aov = 486;

  // Prevented cancellations = 38,500 × 11% × selected reduction %
  const preventedCancellations = Math.round(
    monthlyOrders * baseCancellationRate * (reductionPercent / 100)
  );

  // Illustrative value protected = prevented cancellations × ₹486
  const illustrativeValueProtected = Math.round(preventedCancellations * aov);

  // Store action triggers
  const handleTriggerAudit = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id === storeId) {
          return {
            ...s,
            shelfAuditStatus: "Up to Date",
            status: "Audited",
            currentScore: Math.min(100, s.currentScore + 18),
            riskLevel: "MEDIUM_RISK",
          };
        }
        return s;
      })
    );
    const store = stores.find((s) => s.id === storeId);
    setActionAlert(`Dispatched Priority Shelf Audit to ${store?.name}. Store manager alerted on handheld terminal.`);
    setTimeout(() => setActionAlert(null), 5000);
  };

  const handleAutoReroute = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id === storeId) {
          return {
            ...s,
            status: "Auto-Rerouted",
            currentScore: Math.min(100, s.currentScore + 25),
            riskLevel: "HIGH_RELIABILITY",
          };
        }
        return s;
      })
    );
    const store = stores.find((s) => s.id === storeId);
    // Add to protected orders list
    const newProtected: ProtectedOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: "Just now",
      productName: "Surge Batch Re-assignment (18 items)",
      originalStore: `${store?.name} (Risk Factor)`,
      assignedStore: "Reliance Smart Point / Apollo Quick Mart",
      originalRisk: "HIGH RISK (Predicted Drop)",
      newConfidence: 92,
      customerSavedFromCancellation: true,
    };
    setProtectedOrders((prev) => [newProtected, ...prev]);
    setActionAlert(`Auto-Assure Rerouting Engaged: Protected ${store?.activeOrders} active orders from ${store?.name}.`);
    setTimeout(() => setActionAlert(null), 5000);
  };

  const handleResetOperations = () => {
    setStores(INITIAL_RISKY_STORES);
    setProtectedOrders(INITIAL_PROTECTED_ORDERS);
    setActionAlert("Operations dashboard state reset to live baseline.");
    setTimeout(() => setActionAlert(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
              Overview
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Operations Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Operations & Fulfilment Risk Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            System-wide network monitoring preventing stockout-driven churn across dark stores and merchant partners.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/customer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <span>Customer View</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <button
            onClick={handleResetOperations}
            className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
          >
            Reset Metrics
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionAlert && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="h-7 w-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </span>
            <span className="font-semibold">{actionAlert}</span>
          </div>
          <button onClick={() => setActionAlert(null)} className="text-blue-700 text-xs font-bold px-2 py-1">
            Dismiss
          </button>
        </div>
      )}

      {/* CORE BUSINESS PROBLEM CALLOUT (Crucial Hackathon Context) */}
      <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-extrabold uppercase tracking-wider">
              NOVA CART Business Diagnosis
            </span>
            <span className="text-xs text-slate-400">Q3 Metric Bleed Analysis</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            NOVA CART does not primarily have a demand problem; it has a fulfilment reliability problem.
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Customers love ordering on NOVA CART, but stale inventory and silent merchant stockouts are driving cancellations and destroying brand repeat retention.
          </p>

          {/* 4 Crucial Metric Deltas */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Repeat Purchase</div>
              <div className="text-2xl font-black text-rose-400 mt-1">
                41% ➔ 27%
              </div>
              <div className="text-[10px] text-rose-300 font-semibold mt-0.5">-14% churn decline</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cancellation Rate</div>
              <div className="text-2xl font-black text-rose-400 mt-1">
                6% ➔ 11%
              </div>
              <div className="text-[10px] text-rose-300 font-semibold mt-0.5">35% due to inventory</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg Delivery Time</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                29 ➔ 37 min
              </div>
              <div className="text-[10px] text-amber-300 font-semibold mt-0.5">+8 mins search latency</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Support Tickets</div>
              <div className="text-2xl font-black text-rose-400 mt-1">
                3.1k ➔ 5.9k
              </div>
              <div className="text-[10px] text-rose-300 font-semibold mt-0.5">+90% ticket escalation/mo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time KPI Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active Orders</span>
            <span className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
              ⚡
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-3">{totalOrders.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Across 18 dark stores & hubs
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">At-Risk Orders</span>
            <span className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              ⚠️
            </span>
          </div>
          <div className="text-3xl font-black text-amber-600 mt-3">{atRiskCount}</div>
          <div className="text-xs text-amber-700 mt-1 font-medium">
            Requires store audit or rerouting
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Predicted Cancellations</span>
            <span className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
              ✕
            </span>
          </div>
          <div className="text-3xl font-black text-rose-600 mt-3">{predictedCancellations}</div>
          <div className="text-xs text-rose-700 mt-1 font-medium">
            ~11% network cancellation baseline
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Potentially Protected</span>
            <span className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              🛡️
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-3">{protectedOrdersCount}</div>
          <div className="text-xs text-emerald-700 mt-1 font-medium">
            Orders saved via NOVA ASSURE failover
          </div>
        </div>
      </div>

      {/* NOVA ASSURE Operations Insight Panel */}
      <div className="mt-8 bg-white rounded-2xl border-2 border-blue-500/30 p-6 sm:p-7 shadow-lg shadow-blue-500/5 relative overflow-hidden">
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  NOVA ASSURE Operations Insight
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Explainable Recommendation
                </span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                  Deterministic Logic • Offline Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated root cause diagnostics and intervention guidance based on live network telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateInsight}
              disabled={isGeneratingInsight}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isGeneratingInsight ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing Telemetry...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span>Generate Insight</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Insight Content */}
        <div className="mt-5 space-y-4">
          {/* Executive Headline Quote */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-start gap-2.5">
              <span className="text-xl leading-none text-blue-600 font-serif">“</span>
              <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                {currentInsight.headline}
              </p>
              <span className="text-xl leading-none text-blue-600 font-serif self-end">”</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Telemetry sample: 1,482 orders • 4 monitored Bangalore zones</span>
              <span>Updated: {currentInsight.timestamp}</span>
            </div>
          </div>

          {/* 3 Pillars: Main Risk | Evidence | Recommended Action */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Main Risk */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800 mb-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-600"></span>
                Main Risk
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-1">
                {currentInsight.mainRisk}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentInsight.mainRiskDetail}
              </p>
            </div>

            {/* 2. Evidence */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-600"></span>
                Evidence
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-1">
                {currentInsight.evidenceHeadline}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentInsight.evidence}
              </p>
            </div>

            {/* 3. Recommended Action */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                Recommended Action
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-1">
                {currentInsight.actionHeadline}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentInsight.recommendedAction}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Top Risk Reasons & Recommended Actions */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Risk Reasons (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Top Root Causes of Order Failure
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Based on 5,900 customer support tickets</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
              35% Unavailability
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">1. Ghost Inventory / Stale Store Sync</span>
                <span className="font-extrabold text-rose-600">35% of cancellations</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: "35%" }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">App displays item in stock, but shelf is empty when picker arrives.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">2. Store Acceptance Delay (&gt;4 mins)</span>
                <span className="font-extrabold text-amber-600">25% of cancellations</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "25%" }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Merchant ignores order notifications during high offline counter traffic.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">3. Rider Supply Bottleneck in Cluster</span>
                <span className="font-extrabold text-blue-600">20% of cancellations</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "20%" }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Delivery partner shortage leading to 37+ minute SLA breaches.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">4. Transit Traffic & Severe ETA Drift</span>
                <span className="font-extrabold text-teal-600">10% of cancellations</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: "10%" }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Peak-hour corridor blockages causing customers to cancel mid-transit.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">5. Missing Feasible SKU Substitutes</span>
                <span className="font-extrabold text-slate-700">10% of cancellations</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-600 rounded-full" style={{ width: "10%" }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Absence of automated alternate brand recommendations at checkout.</p>
            </div>
          </div>
        </div>

        {/* Top Risky Stores Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Top Risky Stores (Action Queue)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Live intervention console for operations managers</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {stores.length} flagged locations
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {stores.map((store) => (
              <div
                key={store.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{store.name}</h4>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        store.riskLevel === "HIGH_RISK"
                          ? "bg-rose-100 text-rose-800"
                          : store.riskLevel === "MEDIUM_RISK"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {store.currentScore}% Score
                    </span>
                    {store.status !== "Normal" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {store.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{store.locality}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                    <span>
                      Cancellation: <strong className="text-rose-600">{store.cancellationRate}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Orders at risk: <strong className="text-slate-900">{store.activeOrders}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{store.shelfAuditStatus}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                    Flag: {store.primaryRiskReason}
                  </p>
                </div>

                {/* Operations Action Buttons */}
                <div className="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => handleTriggerAudit(store.id)}
                    className="flex-1 sm:flex-none text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
                  >
                    Trigger Shelf Audit
                  </button>
                  <button
                    onClick={() => handleAutoReroute(store.id)}
                    className="flex-1 sm:flex-none text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                  >
                    Auto-Reroute Traffic
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recently Protected Orders Feed */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Live NOVA ASSURE Interventions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time orders shielded from stockout cancellation via smart fallback routing
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time Protection Engine Active
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                <th className="pb-3 pl-2">Order ID</th>
                <th className="pb-3">Product</th>
                <th className="pb-3">Original Store (Failure Reason)</th>
                <th className="pb-3">Assigned Assure Store</th>
                <th className="pb-3">Confidence</th>
                <th className="pb-3 pr-2">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {protectedOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 pl-2 font-mono font-bold text-slate-900">{ord.id}</td>
                  <td className="py-3.5 font-medium text-slate-900">{ord.productName}</td>
                  <td className="py-3.5 text-rose-600 font-medium">{ord.originalStore}</td>
                  <td className="py-3.5 text-emerald-700 font-semibold">{ord.assignedStore}</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {ord.newConfidence}% Assured
                    </span>
                  </td>
                  <td className="py-3.5 pr-2">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      Saved from Cancellation
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prototype Footer Disclaimer */}
      <div className="mt-14 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
        Prototype — scores are based on simulated data.
      </div>
    </div>
  );
}
