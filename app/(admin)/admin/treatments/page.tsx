"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import ApiMethod from "@/services/api-method";

type Treatment = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isActive: boolean;
};

const emptyForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  isActive: true,
};

export default function AdminTreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const fetchTreatments = async () => {
    setLoading(true);
    try {
      const result = await ApiMethod.get("/api/treatments?all=true");
      if (result.success) {
        setTreatments(result.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (treatment: Treatment) => {
    setEditingId(treatment._id);
    setForm({
      name: treatment.name,
      description: treatment.description,
      price: String(treatment.price),
      image: treatment.image,
      isActive: treatment.isActive,
    });
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image: form.image,
      isActive: form.isActive,
    };

    try {
      const result = editingId
        ? await ApiMethod.put(`/api/treatments/${editingId}`, payload)
        : await ApiMethod.post("/api/treatments", payload);

      if (!result.success) {
        setError(result.message || "Something went wrong");
        return;
      }

      closeForm();
      await fetchTreatments();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deactivate "${name}"? It will be hidden from the booking form.`)) return;

    const result = await ApiMethod.delete(`/api/treatments/${id}`);
    if (result.success) {
      await fetchTreatments();
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Treatments</h1>
          <p className="mt-1 text-slate-500">Manage services available for appointment booking.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Treatment
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Treatment" : "Add Treatment"}
              </h2>
              <button onClick={closeForm} className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Root Canal Treatment"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Brief description of the treatment"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={form.isActive ? "active" : "inactive"}
                    onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL *</label>
                <input
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="/dentist_treating_patient.jpg"
                />
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
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
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
        ) : treatments.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-slate-500">No treatments yet.</p>
            <button
              onClick={openCreateForm}
              className="mt-4 text-brand-600 font-semibold hover:underline cursor-pointer"
            >
              Add your first treatment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="px-4 py-3 font-semibold text-slate-600">Treatment</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Description</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Price</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((treatment) => (
                  <tr key={treatment._id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {treatment.image && (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            <Image
                              src={treatment.image}
                              alt={treatment.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="font-semibold text-slate-900">{treatment.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500 hidden lg:table-cell max-w-xs truncate">
                      {treatment.description}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-700">₹{treatment.price}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          treatment.isActive
                            ? "bg-brand-50 text-brand-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {treatment.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(treatment)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-600 cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {treatment.isActive && (
                          <button
                            onClick={() => handleDelete(treatment._id, treatment.name)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                            title="Deactivate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
