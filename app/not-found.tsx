import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F4F6F8] text-[#17202A]">
      <div className="text-xs font-mono text-[#0864C7] font-semibold uppercase tracking-wider mb-2">
        SYS.ERR // 404
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
        Vector Coordinate Not Found
      </h1>
      <p className="mt-3 text-sm text-[#647184] max-w-md">
        The requested route or engineering project coordinate does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#CBD5E1] text-xs font-mono font-semibold text-[#17202A] hover:text-[#0864C7] hover:border-[#178BFF]/40 shadow-xs transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Portfolio Home</span>
      </Link>
    </div>
  );
}
