"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { INITIAL_PRODUCTS, computeFulfilmentScore } from "@/data/mockData";
import { Product, StoreOption, CalculatedScore } from "@/types";

export default function CustomerPage() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>("prod-1");
  const [selectedStoreId, setSelectedStoreId] = useState<string>("store-apollo");

  // Simulation State
  const [isSimulatedFailure, setIsSimulatedFailure] = useState(false);
  const [switchSuccessMessage, setSwitchSuccessMessage] = useState<string | null>(null);
  const [showFormulaBreakdown, setShowFormulaBreakdown] = useState(false);

  // Active Product
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || products[0],
    [products, selectedProductId]
  );

  // Filtered Products for Search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Compute live state of stores for the current product
  const liveStores = useMemo(() => {
    return selectedProduct.stores.map((store) => {
      // If simulated failure is active and this is the selected store, trigger severe inventory failure
      if (isSimulatedFailure && store.id === selectedStoreId) {
        const failedFactors = {
          ...store.factors,
          inventoryConfidence: 4, // severe inventory collapse (ghost inventory)
          storeAcceptance: 45,
          deliveryReliability: 40,
          etaAccuracy: 30,
          substitutionReliability: 25,
        };
        const score = computeFulfilmentScore(failedFactors);
        return {
          ...store,
          inStock: false,
          stockCount: 0,
          factors: failedFactors,
          computedScore: score,
          reasons: [
            "CRITICAL: Ghost inventory detected — physical shelf audit indicates 0 units",
            "Store manager failed to verify stock during pick wave",
            "Estimated 89% chance of customer cancellation at checkout",
          ],
          isFailed: true,
        };
      }

      // Normal store state
      const score = computeFulfilmentScore(store.factors);
      return {
        ...store,
        computedScore: score,
        isFailed: false,
      };
    });
  }, [selectedProduct, isSimulatedFailure, selectedStoreId]);

  // Current Active Store
  const activeStore = useMemo(() => {
    return liveStores.find((s) => s.id === selectedStoreId) || liveStores[0];
  }, [liveStores, selectedStoreId]);

  // Best Alternative Store recommendation (if failure occurs or user wants best backup)
  const recommendedAlternative = useMemo(() => {
    const candidates = liveStores
      .filter((s) => s.id !== activeStore.id && s.inStock)
      .sort((a, b) => b.computedScore.totalScore - a.computedScore.totalScore);
    return candidates[0] || null;
  }, [liveStores, activeStore.id]);

  // Simulation Handlers
  const handleTriggerFailure = () => {
    setIsSimulatedFailure(true);
    setSwitchSuccessMessage(null);
  };

  const handleResetSimulation = () => {
    setIsSimulatedFailure(false);
    setSwitchSuccessMessage(null);
  };

  const handleApplyRecommendedStore = () => {
    if (recommendedAlternative) {
      const prevStoreName = activeStore.name;
      setSelectedStoreId(recommendedAlternative.id);
      setIsSimulatedFailure(false);
      setSwitchSuccessMessage(
        `Assure Failover Applied: Re-routed order from ${prevStoreName} to ${recommendedAlternative.name}. Fulfilment score upgraded to ${recommendedAlternative.computedScore.totalScore}%.`
      );
      setTimeout(() => setSwitchSuccessMessage(null), 6000);
    }
  };

  const getScoreBadgeClass = (level: string) => {
    switch (level) {
      case "HIGH_RELIABILITY":
        return "bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-500/20";
      case "MEDIUM_RISK":
        return "bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-500/20";
      case "HIGH_RISK":
      default:
        return "bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-500/20 animate-pulse";
    }
  };

  const getScoreColorHex = (level: string) => {
    switch (level) {
      case "HIGH_RELIABILITY":
        return "text-emerald-600";
      case "MEDIUM_RISK":
        return "text-amber-600";
      case "HIGH_RISK":
      default:
        return "text-rose-600";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner Navigation & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Overview
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Customer Assurance View
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-400">
              Prototype — scores are based on simulated data.
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Customer Order & Fulfilment Assurance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Multi-store fulfilment confidence scoring preventing out-of-stock cancellations before payment.
          </p>
        </div>

        {/* Quick Nav to Operations */}
        <div className="flex items-center gap-3">
          <Link
            href="/operations-center"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25l2.25 2.25 4.5-4.5" />
            </svg>
            <span>Open Operations Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Success Notification Alert */}
      {switchSuccessMessage && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </span>
            <span className="font-medium">{switchSuccessMessage}</span>
          </div>
          <button
            onClick={() => setSwitchSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Core Simulation Control Bar (Hackathon Demo Tool) */}
      <div className={`mt-6 p-5 sm:p-6 rounded-2xl text-white shadow-xl transition-all duration-300 ${
        isSimulatedFailure
          ? "bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 border-2 border-rose-500 ring-4 ring-rose-500/20"
          : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${
              isSimulatedFailure
                ? "bg-rose-600 text-white border-rose-400 animate-pulse"
                : "bg-rose-500/20 text-rose-400 border-rose-500/30"
            }`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isSimulatedFailure ? "text-rose-300" : "text-rose-400"
                }`}>
                  {isSimulatedFailure ? "⚠️ SIMULATION RUNNING: INVENTORY COLLAPSED" : "Live Hackathon Interactive Test"}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                  {isSimulatedFailure ? "High Risk Active" : "Core Feature"}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-white mt-0.5">
                {isSimulatedFailure
                  ? `Ghost Inventory Triggered on ${activeStore.name} (Score Dropped to ${activeStore.computedScore.totalScore}%)`
                  : "Simulate Instant Inventory Failure on Active Store"}
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                {isSimulatedFailure
                  ? "Simulates the 35% of cancellations caused by out-of-stock items in dark stores."
                  : "Click below to see NOVA ASSURE detect out-of-stock risk and recommend an alternative store."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {!isSimulatedFailure ? (
              <button
                id="simulate-failure-btn"
                onClick={handleTriggerFailure}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <span>Simulate Inventory Failure</span>
              </button>
            ) : (
              <>
                {recommendedAlternative && (
                  <button
                    onClick={handleApplyRecommendedStore}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                    <span>Switch to {recommendedAlternative.name} ({recommendedAlternative.computedScore.totalScore}%)</span>
                  </button>
                )}
                <button
                  onClick={handleResetSimulation}
                  className="px-4 py-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors cursor-pointer"
                >
                  Reset Simulation
                </button>
              </>
            )}

            <button
              onClick={() => setShowFormulaBreakdown(!showFormulaBreakdown)}
              className="px-3.5 py-3 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Inspect Scoring Formula"
            >
              {showFormulaBreakdown ? "Hide Math" : "View Formula"}
            </button>
          </div>
        </div>
      </div>

      {/* Scoring Formula Breakdown Drawer */}
      {showFormulaBreakdown && (
        <div className="mt-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              NOVA ASSURE Scoring Formula Weights
            </h3>
            <span className="text-xs text-slate-400">Total = 100%</span>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Inventory Confidence</div>
              <div className="text-lg font-extrabold text-emerald-600 mt-1">35%</div>
              <div className="text-[10px] text-slate-400">Primary failure driver</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Store Acceptance</div>
              <div className="text-lg font-extrabold text-blue-600 mt-1">25%</div>
              <div className="text-[10px] text-slate-400">Merchant response speed</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Delivery Reliability</div>
              <div className="text-lg font-extrabold text-indigo-600 mt-1">20%</div>
              <div className="text-[10px] text-slate-400">Rider capacity & batching</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">ETA Accuracy</div>
              <div className="text-lg font-extrabold text-teal-600 mt-1">10%</div>
              <div className="text-[10px] text-slate-400">Historic route precision</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Substitution Reliability</div>
              <div className="text-lg font-extrabold text-slate-700 mt-1">10%</div>
              <div className="text-[10px] text-slate-400">Feasible brand alternates</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left Column (Product Search & Selection), Right Column (Assurance Score & Stores) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Product Search & Indian Catalog Items (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Search Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              1. Search Product
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search milk, atta, oil, chocolate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <svg
                className="w-5 h-5 text-slate-400 absolute left-3 top-3"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>

            {/* Quick Product Selector List */}
            <div className="mt-4 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Sample Indian Catalog Item
              </span>
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredProducts.map((product) => {
                  const isSelected = product.id === selectedProductId;
                  return (
                    <button
                      key={product.id}
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setSelectedStoreId(product.stores[0].id);
                        setIsSimulatedFailure(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-emerald-50/80 border-emerald-400 shadow-sm"
                          : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900 leading-snug">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{product.unit}</span>
                          <span>•</span>
                          <span className="text-slate-700 font-medium">₹{product.price}</span>
                          <span className="line-through text-slate-400 text-[10px]">₹{product.mrp}</span>
                        </div>
                      </div>
                      <div className="shrink-0 pl-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {product.stores.length} stores
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Product Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {selectedProduct.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedProduct.unit}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-slate-900">₹{selectedProduct.price}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">
                  Save ₹{selectedProduct.mrp - selectedProduct.price}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Standard delivery radius: 4.5 km</span>
              <span className="text-emerald-700 font-semibold">Instant Dispatch</span>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Store Comparison & Active Store Fulfilment Confidence (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 2: Store Selection Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Choose Nearby Partner Store
                </h2>
                <p className="text-sm font-semibold text-slate-800">
                  Stores ranked by real-time fulfilment reliability
                </p>
              </div>
              <div className="text-xs text-slate-500">
                Location: <span className="font-semibold text-slate-700">Koramangala, Bengaluru</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {liveStores.map((store) => {
                const isSelected = store.id === selectedStoreId;
                const scoreObj = store.computedScore;

                return (
                  <button
                    key={store.id}
                    onClick={() => {
                      setSelectedStoreId(store.id);
                      setIsSimulatedFailure(false);
                      setSwitchSuccessMessage(null);
                    }}
                    className={`relative text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-md"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    } ${store.isFailed ? "border-rose-400 bg-rose-50/40" : ""}`}
                  >
                    <div>
                      {/* Store header and Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 leading-snug">
                            {store.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {store.locality} ({store.distanceKm} km)
                          </p>
                        </div>
                        <div
                          className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${getScoreBadgeClass(
                            scoreObj.riskLevel
                          )}`}
                        >
                          {scoreObj.totalScore}%
                        </div>
                      </div>

                      {/* Delivery Time & Stock */}
                      <div className="mt-3 flex items-center gap-3 text-xs">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          ~{store.estimatedDeliveryMins} mins
                        </span>
                        <span>•</span>
                        <span className={store.inStock ? "text-emerald-700 font-medium" : "text-rose-600 font-bold"}>
                          {store.inStock ? `${store.stockCount} units verified` : "Out of stock / Ghost stock"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-500">
                        {scoreObj.riskLabel}
                      </span>
                      {isSelected ? (
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                          Selected Store
                        </span>
                      ) : (
                        <span className="text-slate-400">Click to Select</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Transparent Fulfilment Confidence Score Card for Selected Store */}
          <div className={`bg-white rounded-2xl border p-6 sm:p-7 shadow-md transition-all ${
            isSimulatedFailure ? "border-rose-400 bg-rose-50/10" : "border-slate-200"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Transparent Fulfilment Confidence
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getScoreBadgeClass(
                      activeStore.computedScore.riskLevel
                    )}`}
                  >
                    {activeStore.computedScore.riskLabel}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {activeStore.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeStore.locality} • Delivery in ~{activeStore.estimatedDeliveryMins} mins
                </p>
              </div>

              {/* Huge Score Circle/Tile */}
              <div className="flex items-baseline sm:flex-col sm:items-end gap-2 sm:gap-0">
                <div className={`text-4xl sm:text-5xl font-black tracking-tight ${getScoreColorHex(activeStore.computedScore.riskLevel)}`}>
                  {activeStore.computedScore.totalScore}
                  <span className="text-xl sm:text-2xl font-bold text-slate-400">/100</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  Confidence Score
                </span>
              </div>
            </div>

            {/* Factors Bar Chart (Visual Breakdown of the 5 weighted components) */}
            <div className="mt-6 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Weighted Reliability Metrics (Formula Breakdown)
              </h4>

              {/* 1. Inventory Confidence (35%) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Inventory Confidence (35% weight)
                  </span>
                  <span className="font-bold text-slate-900">
                    {activeStore.factors.inventoryConfidence}%
                    <span className="text-slate-400 font-normal ml-1">
                      (contrib: {activeStore.computedScore.weightedBreakdown.inventory} pts)
                    </span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      activeStore.factors.inventoryConfidence < 50
                        ? "bg-rose-500"
                        : activeStore.factors.inventoryConfidence < 75
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${activeStore.factors.inventoryConfidence}%` }}
                  />
                </div>
              </div>

              {/* 2. Store Acceptance (25%) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    Store Acceptance Speed (25% weight)
                  </span>
                  <span className="font-bold text-slate-900">
                    {activeStore.factors.storeAcceptance}%
                    <span className="text-slate-400 font-normal ml-1">
                      (contrib: {activeStore.computedScore.weightedBreakdown.acceptance} pts)
                    </span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${activeStore.factors.storeAcceptance}%` }}
                  />
                </div>
              </div>

              {/* 3. Delivery Reliability (20%) */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                    Delivery & Rider Reliability (20% weight)
                  </span>
                  <span className="font-bold text-slate-900">
                    {activeStore.factors.deliveryReliability}%
                    <span className="text-slate-400 font-normal ml-1">
                      (contrib: {activeStore.computedScore.weightedBreakdown.delivery} pts)
                    </span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${activeStore.factors.deliveryReliability}%` }}
                  />
                </div>
              </div>

              {/* 4 & 5. ETA Accuracy (10%) & Substitution Reliability (10%) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600">ETA Accuracy (10%)</span>
                    <span className="font-bold text-slate-800">{activeStore.factors.etaAccuracy}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${activeStore.factors.etaAccuracy}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600">Substitution Reliability (10%)</span>
                    <span className="font-bold text-slate-800">{activeStore.factors.substitutionReliability}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-600 rounded-full"
                      style={{ width: `${activeStore.factors.substitutionReliability}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reasons / Real-world audit logs */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Observed Factors & Reasons
              </h4>
              <ul className="space-y-2">
                {activeStore.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    {activeStore.isFailed ? (
                      <svg className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                    <span className={activeStore.isFailed ? "font-semibold text-rose-900" : ""}>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CRITICAL DEMO: HIGH RISK ALERT & BEST ALTERNATIVE STORE RECOMMENDATION */}
          {isSimulatedFailure && (
            <div className="rounded-2xl border-2 border-rose-400 bg-rose-50/50 p-6 sm:p-7 shadow-lg animate-fade-in space-y-6">
              {/* Failure Banner */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 text-xs font-bold mb-1">
                    ORDER STATUS: HIGH RISK (Predicted Failure)
                  </div>
                  <h3 className="text-lg font-bold text-rose-950">
                    Product Unavailable at {activeStore.name}!
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed">
                    NOVA ASSURE detected a <strong>stale catalog discrepancy</strong>. The product is physically out of stock. If routed here, this order would become part of the <strong>35% cancellation rate</strong> damaging NOVA CART.
                  </p>
                </div>
              </div>

              {/* Recommended Store Callout */}
              {recommendedAlternative && (
                <div className="bg-white rounded-xl border border-emerald-300 p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                        ✓
                      </span>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                        NOVA ASSURE Recommended Alternative
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      Score: {recommendedAlternative.computedScore.totalScore}% (Reliable)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">
                        {recommendedAlternative.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {recommendedAlternative.locality} • {recommendedAlternative.distanceKm} km away • {recommendedAlternative.stockCount} verified units in stock
                      </p>
                      <p className="text-xs text-emerald-700 font-semibold mt-1">
                        ETA: ~{recommendedAlternative.estimatedDeliveryMins} mins (Only +{Math.max(0, recommendedAlternative.estimatedDeliveryMins - activeStore.estimatedDeliveryMins)} mins difference)
                      </p>
                    </div>

                    <button
                      onClick={handleApplyRecommendedStore}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02] shrink-0"
                    >
                      <span>Switch to Recommended Store</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>

                  {/* Before / After Improvement Comparison Matrix */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Protection Impact Matrix (Original vs. Recommended)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[11px] text-slate-500">Fulfilment Score</div>
                        <div className="text-sm font-bold mt-1 text-slate-700">
                          <span className="text-rose-600 line-through mr-1.5">{activeStore.computedScore.totalScore}%</span>
                          <span className="text-emerald-600 text-base font-extrabold">
                            ➔ {recommendedAlternative.computedScore.totalScore}%
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                          +{recommendedAlternative.computedScore.totalScore - activeStore.computedScore.totalScore} pts improvement
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[11px] text-slate-500">Risk Assessment</div>
                        <div className="text-sm font-bold mt-1 text-slate-700">
                          <span className="text-rose-600 line-through mr-1.5">High Risk</span>
                          <span className="text-emerald-600 font-extrabold">➔ Assured</span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                          Cancellation Prevented
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[11px] text-slate-500">Inventory Reality</div>
                        <div className="text-sm font-bold mt-1 text-slate-700">
                          <span className="text-rose-600 line-through mr-1.5">0 Units</span>
                          <span className="text-emerald-600 font-extrabold">➔ {recommendedAlternative.stockCount} Units</span>
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                          Verified barcode audit
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prototype Footer Disclaimer */}
      <div className="mt-14 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
        Prototype — scores are based on simulated data.
      </div>
    </div>
  );
}
