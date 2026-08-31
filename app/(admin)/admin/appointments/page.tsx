"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Phone } from "lucide-react";
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

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    setUpdatingId(id);
    try {
      const result = await ApiMethod.put(`/api/appointments/${id}`, { status });
      if (result.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a))
        );
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="px-4 py-3 font-semibold text-slate-600">Patient</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">Treatment</th>
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
                    <td className="px-4 py-4 text-slate-700 hidden sm:table-cell">
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
        )}
      </div>
    </div>
  );
}
