import React from 'react';
import Link from 'next/link';
import { FileText, Download, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'System Documentation & Technical Blueprint | TB Furnitures',
  description: 'Complete architecture specification, database ERD, API reference, and frontend specifications.',
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Store</span>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-[0.2em] text-white text-sm uppercase">
              TB FURNITURES
            </span>
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
              System Blueprint v1.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/TB_Furnitures_Documentation.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open HTML Version</span>
          </a>

          <a
            href="/TB_Furnitures_Technical_Documentation.pdf"
            download="TB_Furnitures_Technical_Documentation.pdf"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg shadow-lg shadow-amber-950/40 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF</span>
          </a>
        </div>
      </header>

      {/* Main Document Viewer */}
      <main className="flex-1 flex flex-col w-full h-[calc(100vh-64px)]">
        <iframe
          src="/TB_Furnitures_Documentation.html"
          title="TB Furnitures Technical Specification Document"
          className="w-full h-full border-0 bg-white"
        />
      </main>
    </div>
  );
}
