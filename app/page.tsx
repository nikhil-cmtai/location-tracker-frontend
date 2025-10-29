import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--content-bg)]">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-lg border border-[var(--border-light)] p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[var(--primary-orange)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-3xl">ES</span>
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Welcome to
            </h1>
            <h2 className="text-2xl font-bold text-[var(--primary-orange)]">
              EVERONIC SOLUTIONS
            </h2>
            <p className="text-[var(--text-secondary)] mt-4">
              Location Tracker Dashboard
            </p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-3 w-full bg-[var(--primary-orange)] hover:bg-[var(--primary-orange-hover)] text-white font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
