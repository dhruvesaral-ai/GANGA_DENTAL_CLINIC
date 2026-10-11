"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Phone, X, ChevronRight } from "lucide-react";
import ApiMethod from "@/services/api-method";

type AppointmentStatus = "pending" | "confirmed" | "cancelled";

type Appointment = {
  _id: string;
  name: string;
  phone: string;
  message: string;
  preferredDate: string;
  enquiryDate: string;
  status: AppointmentStatus;
  preferredTreatment: { _id: string; name: string } | null;
  createdAt: string;
};

const statusStyles: Record<AppointmentStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-brand-50 text-brand-700",
  cancelled: "bg-slate-100 text-slate-500",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const result = await ApiMethod.get("/api/appointments");
      if (result.success) {
        setAppointments(result.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selected]);

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    setUpdatingId(id);
    try {
      const result = await ApiMethod.put(`/api/appointments/${id}`, { status });
      if (result.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a))
        );
        setSelected((prev) => (prev && prev._id === id ? { ...prev, status } : prev));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete appointment for "${name}"?`)) return;

    const result = await ApiMethod.delete(`/api/appointments/${id}`);
    if (result.success) {
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      setSelected((prev) => (prev?._id === id ? null : prev));
    }
  };

  return (
    <div className="max-w-6xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Appointments</h1>
        <p className="mt-1 text-slate-500">View and manage booking requests from patients.</p>
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-slate-500">No appointments yet.</p>
            <p className="mt-1 text-sm text-slate-400">
              New booking requests from the website will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="md:hidden divide-y divide-slate-100">
              {appointments.map((appointment) => (
                <button
                  key={appointment._id}
                  type="button"
                  onClick={() => setSelected(appointment)}
                  className="w-full text-left px-4 py-4 flex items-center gap-3 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{appointment.name}</p>
                    <p className="text-sm text-slate-500 truncate">
                      {appointment.preferredTreatment?.name ?? "No treatment"} ·{" "}
                      {formatDate(appointment.preferredDate)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[appointment.status]}`}
                  >
                    {appointment.status}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
                </button>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-left">
                    <th className="px-4 py-3 font-semibold text-slate-600">Patient</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Treatment</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Preferred Date</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">{appointment.name}</p>
                        <a
                          href={`tel:${appointment.phone}`}
                          className="mt-0.5 inline-flex items-center gap-1 text-slate-500 hover:text-brand-600"
                        >
                          <Phone className="w-3 h-3" />
                          {appointment.phone}
                        </a>
                        {appointment.message && (
                          <p className="mt-1 text-xs text-slate-400 max-w-xs truncate">
                            {appointment.message}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {appointment.preferredTreatment?.name ?? "—"}
                      </td>
                      <td className="px-4 py-4 text-slate-700 whitespace-nowrap">
                        {formatDate(appointment.preferredDate)}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={appointment.status}
                          disabled={updatingId === appointment._id}
                          onChange={(e) =>
                            handleStatusChange(
                              appointment._id,
                              e.target.value as AppointmentStatus
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:ring-2 focus:ring-brand-500 ${statusStyles[appointment.status]}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handleDelete(appointment._id, appointment.name)}
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
          </>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            aria-label="Close enquiry"
            onClick={() => setSelected(null)}
          />
          <div className="relative z-10 w-full max-w-md max-h-[90dvh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Enquiry details</h2>
                <p className="text-sm text-slate-500">Received {formatDate(selected.enquiryDate)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-slate-500">Patient</dt>
                <dd className="mt-0.5 text-slate-900 font-medium">{selected.name}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Phone</dt>
                <dd className="mt-0.5">
                  <a
                    href={`tel:${selected.phone}`}
                    className="inline-flex items-center gap-1 text-brand-600 font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    {selected.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Treatment</dt>
                <dd className="mt-0.5 text-slate-900">
                  {selected.preferredTreatment?.name ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Preferred date</dt>
                <dd className="mt-0.5 text-slate-900">{formatDate(selected.preferredDate)}</dd>
              </div>
              {selected.message && (
                <div>
                  <dt className="font-semibold text-slate-500">Message</dt>
                  <dd className="mt-0.5 text-slate-700 whitespace-pre-wrap">{selected.message}</dd>
                </div>
              )}
              <div>
                <dt className="font-semibold text-slate-500 mb-2">Status</dt>
                <dd>
                  <select
                    value={selected.status}
                    disabled={updatingId === selected._id}
                    onChange={(e) =>
                      handleStatusChange(selected._id, e.target.value as AppointmentStatus)
                    }
                    className={`px-3 py-2 rounded-xl text-sm font-semibold border-0 cursor-pointer focus:ring-2 focus:ring-brand-500 ${statusStyles[selected.status]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => handleDelete(selected._id, selected.name)}
              className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete enquiry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
