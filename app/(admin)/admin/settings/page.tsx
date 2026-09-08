"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ApiMethod from "@/services/api-method";

type SeoForm = {
  metaTitle: string;
  metaDescription: string;
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SeoForm>({ metaTitle: "", metaDescription: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const result = await ApiMethod.get("/api/settings");
        if (result.success) {
          setForm({
            metaTitle: result.data.metaTitle,
            metaDescription: result.data.metaDescription,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await ApiMethod.put("/api/settings", form);

      if (!result.success) {
        setError(result.message || "Something went wrong");
        return;
      }

      setForm({
        metaTitle: result.data.metaTitle,
        metaDescription: result.data.metaDescription,
      });
      setSuccess("Settings saved successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
        Manage SEO &amp; Settings
      </h1>
      <p className="mt-1 text-slate-500">
        Update the meta title and description shown in search engines and browser tabs.
      </p>

      <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Meta Title *
              </label>
              <input
                required
                maxLength={70}
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Page title for search results"
              />
              <p className="mt-1 text-xs text-slate-400">{form.metaTitle.length}/70 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Meta Description *
              </label>
              <textarea
                required
                rows={4}
                maxLength={160}
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
                placeholder="Short summary shown in search results"
              />
              <p className="mt-1 text-xs text-slate-400">
                {form.metaDescription.length}/160 characters
              </p>
            </div>

            {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
            {success && <p className="text-sm font-semibold text-brand-600">{success}</p>}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
