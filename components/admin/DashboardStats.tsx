"use client";

import { useEffect, useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import ApiMethod from "@/services/api-method";

export default function DashboardStats() {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    ApiMethod.get("/api/page-visits")
      .then((result) => {
        if (result.success) {
          setVisitCount(result.data.count);
        }
      })
      .catch(() => setVisitCount(0));
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Landing Page Visits</p>
            {visitCount === null ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400 mt-1" />
            ) : (
              <p className="text-2xl font-bold text-slate-900">{visitCount.toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
