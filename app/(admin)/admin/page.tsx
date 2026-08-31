import Link from "next/link";
import { Stethoscope, ArrowRight } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-500">Manage your clinic website content.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/treatments"
          className="group p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
              <Stethoscope className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">Treatments</h2>
          <p className="mt-1 text-sm text-slate-500">
            Add, edit, and manage treatments shown on the booking form.
          </p>
        </Link>
      </div>
    </div>
  );
}
