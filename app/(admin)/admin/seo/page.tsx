"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Pencil,
  Lock,
  Monitor,
  Plus,
  X,
  Save,
} from "lucide-react";
import ApiMethod from "@/services/api-method";

type SeoForm = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
};

function getTitleStatus(length: number) {
  if (length >= 60 && length <= 70) return { color: "bg-emerald-500", label: "Optimal length" };
  if (length > 70) return { color: "bg-red-500", label: "Too long" };
  if (length >= 50) return { color: "bg-amber-500", label: "Almost optimal" };
  return { color: "bg-amber-500", label: "Too short" };
}

function getDescriptionStatus(length: number) {
  if (length <= 160) return { color: "bg-emerald-500", label: "Within limit" };
  return { color: "bg-red-500", label: "Too long" };
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}...`;
}

export default function AdminSeoPage() {
  const [form, setForm] = useState<SeoForm>({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  });
  const [keywordInput, setKeywordInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSeo = async () => {
      setLoading(true);
      try {
        const result = await ApiMethod.get("/api/seo");
        if (result.success) {
          setForm({
            metaTitle: result.data.metaTitle,
            metaDescription: result.data.metaDescription,
            metaKeywords: result.data.metaKeywords ?? [],
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSeo();
  }, []);

  const addKeyword = () => {
    const keyword = keywordInput.trim();
    if (!keyword || form.metaKeywords.includes(keyword)) return;

    setForm((prev) => ({
      ...prev,
      metaKeywords: [...prev.metaKeywords, keyword],
    }));
    setKeywordInput("");
  };

  const removeKeyword = (keyword: string) => {
    setForm((prev) => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter((k) => k !== keyword),
    }));
  };

  const titleLength = form.metaTitle.trim().length;
  const descriptionLength = form.metaDescription.trim().length;
  const titleTooLong = titleLength > 70;
  const descriptionTooLong = descriptionLength > 160;
  const canSave = !titleTooLong && !descriptionTooLong && titleLength > 0 && descriptionLength > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (titleTooLong) {
      setError("Meta title must be 70 characters or fewer.");
      return;
    }

    if (descriptionTooLong) {
      setError(`Meta description is ${descriptionLength} characters. Shorten to 160 or fewer.`);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await ApiMethod.put("/api/seo", form);

      if (!result.success) {
        setError(result.message || "Something went wrong");
        return;
      }

      setForm({
        metaTitle: result.data.metaTitle,
        metaDescription: result.data.metaDescription,
        metaKeywords: result.data.metaKeywords ?? [],
      });
      setSuccess("SEO settings saved successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const titleStatus = getTitleStatus(form.metaTitle.length);
  const descriptionStatus = getDescriptionStatus(form.metaDescription.length);
  const titleProgress = Math.min((form.metaTitle.length / 70) * 100, 100);
  const descriptionProgress = Math.min((form.metaDescription.length / 160) * 100, 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Metadata Attributes</h1>
            <Pencil className="w-5 h-5 text-slate-400" />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Currently editing: <span className="font-semibold text-slate-700">Homepage (/)</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          <Lock className="w-3.5 h-3.5" />
          Production Target
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <label className="text-sm font-semibold text-slate-700">
              SEO Meta Title <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-500">
              {form.metaTitle.length} / 60–70 recommended chars
            </span>
          </div>

          <input
            required
            maxLength={70}
            value={form.metaTitle}
            onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-900"
            placeholder="Clinic name | services and location"
          />

          <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${titleStatus.color}`}
              style={{ width: `${titleProgress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Optimal titles capture primary specialties and geographic relevance without keyword stuffing.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <label className="text-sm font-semibold text-slate-700">
              SEO Meta Description <span className="text-red-500">*</span>
            </label>
            <span
              className={`text-xs font-medium ${
                descriptionTooLong ? "text-red-600" : "text-slate-500"
              }`}
            >
              {form.metaDescription.length} / 160 max recommended chars
            </span>
          </div>

          <textarea
            required
            rows={4}
            maxLength={160}
            value={form.metaDescription}
            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white resize-y text-slate-900"
            placeholder="Short summary shown in search results"
          />

          <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${descriptionStatus.color}`}
              style={{ width: `${descriptionProgress}%` }}
            />
          </div>
          {descriptionTooLong && (
            <p className="mt-2 text-xs font-semibold text-red-500">
              Description is too long. Remove {form.metaDescription.length - 160} characters to save.
            </p>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Target Search Queries &amp; Keywords
          </label>

          <div className="flex flex-wrap gap-2 mb-4">
            {form.metaKeywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-brand-50 text-brand-700 border border-brand-100"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="p-0.5 rounded-full hover:bg-brand-100 cursor-pointer"
                  aria-label={`Remove ${keyword}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword();
                }
              }}
              className="w-full sm:flex-1 min-w-0 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Add a keyword"
            />
            <button
              type="button"
              onClick={addKeyword}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-brand-200 text-brand-700 font-semibold hover:bg-brand-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Keyword
            </button>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-sm font-semibold text-slate-700">
              Google Search Result Preview (Desktop SERP)
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Monitor className="w-4 h-4" />
              Desktop View
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                G
              </div>
              <div>
                <p className="font-medium text-slate-800">Ganga Dental Clinic</p>
                <p className="text-xs text-slate-500">https://gangadentalclinic.com</p>
              </div>
            </div>

            <p className="mt-3 text-xl text-[#1a0dab] font-medium leading-snug">
              {form.metaTitle ? truncate(form.metaTitle, 60) : "Your page title will appear here"}
            </p>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">
              {form.metaDescription
                ? truncate(form.metaDescription, 160)
                : "Your meta description will appear here in search results."}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Local Business
              </span>
              <span>Kankarbagh, Patna</span>
              <span>Open · Closes 6 PM</span>
            </div>
          </div>
        </section>

        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
        {success && <p className="text-sm font-semibold text-brand-600">{success}</p>}

        <button
          type="submit"
          disabled={saving || !canSave}
          className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save SEO Settings"}
        </button>
      </form>
    </div>
  );
}
