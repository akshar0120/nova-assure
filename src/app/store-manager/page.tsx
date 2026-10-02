"use client";

import { useState } from "react";
import Link from "next/link";

interface AuditItem {
  id: string;
  name: string;
  category: string;
  appCount: number;
  physicalCount: number;
  status: "MATCHED" | "DISCREPANCY" | "CRITICAL_GHOST";
}

export default function StoreManagerPage() {
  const [items, setItems] = useState<AuditItem[]>([
    {
      id: "1",
      name: "Amul Taaza Fresh Toned Milk (500ml)",
      category: "Dairy",
      appCount: 14,
      physicalCount: 14,
      status: "MATCHED",
    },
    {
      id: "2",
      name: "Aashirvaad Shudh Atta (5kg)",
      category: "Staples",
      appCount: 8,
      physicalCount: 8,
      status: "MATCHED",
    },
    {
      id: "3",
      name: "Fortune Sunlite Refined Oil (1L)",
      category: "Edible Oil",
      appCount: 6,
      physicalCount: 0,
      status: "CRITICAL_GHOST",
    },
    {
      id: "4",
      name: "Cadbury Dairy Milk Silk (150g)",
      category: "Chocolates",
      appCount: 12,
      physicalCount: 10,
      status: "DISCREPANCY",
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const handleReconcile = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            appCount: item.physicalCount,
            status: "MATCHED",
          };
        }
        return item;
      })
    );
    const item = items.find((i) => i.id === id);
    setNotification(`Catalog synchronized for "${item?.name}". App stock updated to ${item?.physicalCount} units.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      {/* Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Overview
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Store Manager Terminal (Apollo Quick Mart)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Physical shelf audit & stock sync preventing 35% ghost inventory cancellations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/customer"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Customer View
          </Link>
          <Link
            href="/operations-center"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            Operations
          </Link>
        </div>
      </div>

      {notification && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-blue-700 text-xs font-bold px-2 py-1">
            Dismiss
          </button>
        </div>
      )}

      {/* Shelf Reconciliation Table */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Live Shelf vs. Digital Catalog Audit
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Discrepancies here directly degrade the store's Fulfilment Confidence Score.
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Handheld Scanner Sync: Online
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                <th className="pb-3 pl-2">Product Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">App Displayed Stock</th>
                <th className="pb-3">Shelf Physical Count</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 pl-2 font-medium text-slate-900">{item.name}</td>
                  <td className="py-3.5">{item.category}</td>
                  <td className="py-3.5 font-mono font-bold">{item.appCount} units</td>
                  <td className="py-3.5 font-mono font-bold text-slate-800">{item.physicalCount} units</td>
                  <td className="py-3.5">
                    {item.status === "MATCHED" && (
                      <span className="px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ Verified Match
                      </span>
                    )}
                    {item.status === "DISCREPANCY" && (
                      <span className="px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        ⚠️ -2 Units Gap
                      </span>
                    )}
                    {item.status === "CRITICAL_GHOST" && (
                      <span className="px-2 py-0.5 rounded font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        ✕ Ghost Stock (Empty Shelf)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    {item.status !== "MATCHED" ? (
                      <button
                        onClick={() => handleReconcile(item.id)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                      >
                        Reconcile Catalog
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-semibold text-xs">Synchronized</span>
                    )}
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
