import Link from 'next/link';
import { ArrowLeft, Layers } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F4F6F8] text-[#17202A]">
      <div className="text-xs font-mono text-[#0864C7] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF]" />
        <span>404 · BUILD ROUTE</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
        That path didn&apos;t make the build.
      </h1>

      <p className="mt-2 text-xs sm:text-sm font-mono text-[#647184] max-w-sm">
        The requested coordinate or asset is not part of this release.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#CBD5E1] text-xs font-mono font-semibold text-[#17202A] hover:text-[#0864C7] shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back Home</span>
        </Link>

        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#178BFF] text-white text-xs font-mono font-bold hover:bg-[#0864C7] shadow-xs transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>View Projects</span>
        </Link>
      </div>
    </div>
  );
}
