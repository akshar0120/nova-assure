import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NOVA ASSURE | Fulfilment Reliability for NOVA CART",
  description:
    "NOVA ASSURE helps NOVA CART predict fulfilment risks, improve inventory reliability, and prevent avoidable order failures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-200">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-slate-900">NOVA</span>
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    ASSURE
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
                  for NOVA CART
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/customer"
                className="text-xs sm:text-sm font-medium text-slate-600 hover:text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Customer
              </Link>
              <Link
                href="/store-manager"
                className="text-xs sm:text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Store Manager
              </Link>
              <Link
                href="/operations-center"
                className="text-xs sm:text-sm font-medium text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Operations
              </Link>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                System Ready
              </span>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700">NOVA ASSURE</span> — Built for Hackathon
            </p>
            <p className="text-slate-400">
              Reliability intelligence & fulfilment assurance for local commerce.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
