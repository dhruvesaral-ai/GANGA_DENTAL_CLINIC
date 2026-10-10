"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import ApiMethod from "@/services/api-method";
import JsonEditorField from "@/components/admin/JsonEditorField";

type Setting = {
  _id: string;
  key: string;
  value: unknown;
};

function previewValue(value: unknown) {
  try {
    const text = JSON.stringify(value);
    return text.length > 80 ? `${text.slice(0, 80)}...` : text;
  } catch {
    return String(value);
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formKey, setFormKey] = useState("");
  const [formValue, setFormValue] = useState<unknown>({});

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const result = await ApiMethod.get("/api/settings");
      if (result.success) {
        setSettings(result.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const openCreateForm = () => {
    setEditingKey(null);
    setFormKey("");
    setFormValue({});
    setError("");
    setShowForm(true);
  };

  const openEditForm = (setting: Setting) => {
    setEditingKey(setting.key);
    setFormKey(setting.key);
    setFormValue(setting.value);
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingKey(null);
    setFormKey("");
    setFormValue({});
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const result = editingKey
        ? await ApiMethod.put(`/api/settings/${encodeURIComponent(editingKey)}`, {
            value: formValue,
          })
        : await ApiMethod.post("/api/settings", {
            key: formKey,
            value: formValue,
          });

      if (!result.success) {
        setError(result.message || "Something went wrong");
        return;
      }

      closeForm();
      await fetchSettings();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete setting "${key}"?`)) return;

    const result = await ApiMethod.delete(`/api/settings/${encodeURIComponent(key)}`);
    if (result.success) {
      await fetchSettings();
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-slate-500">
            Manage custom key-value settings. Values can be strings, numbers, objects, or arrays.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Setting
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingKey ? `Edit "${editingKey}"` : "Add Setting"}
              </h2>
              <button onClick={closeForm} className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Key *</label>
                <input
                  required
                  disabled={!!editingKey}
                  value={formKey}
                  onChange={(e) => setFormKey(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="e.g. clinic_hours"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Lowercase letters, numbers, and underscores only.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Value *</label>
                <JsonEditorField value={formValue} onChange={setFormValue} />
              </div>

              {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 py-3 rounded-full border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving..." : editingKey ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : settings.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-slate-500">No custom settings yet.</p>
            <button
              onClick={openCreateForm}
              className="mt-4 text-brand-600 font-semibold hover:underline cursor-pointer"
            >
              Add your first setting
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="px-4 py-3 font-semibold text-slate-600">Key</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Value</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {settings.map((setting) => (
                  <tr key={setting._id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-4 font-mono font-semibold text-slate-900">
                      {setting.key}
                    </td>
                    <td className="px-4 py-4 text-slate-500 font-mono text-xs max-w-md truncate">
                      {previewValue(setting.value)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(setting)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-600 cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(setting.key)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
