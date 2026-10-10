"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Stethoscope,
  Eye,
  Globe,
  ArrowRight,
  Clock,
  Loader2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Settings,
} from "lucide-react";
import ApiMethod from "@/services/api-method";

type AppointmentStatus = "pending" | "confirmed" | "cancelled";

type Appointment = {
  _id: string;
  name: string;
  preferredDate: string;
  status: AppointmentStatus;
  preferredTreatment: { name: string } | null;
};

type Treatment = {
  _id: string;
  isActive: boolean;
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

type StatCardProps = {
  label: string;
  value: number | null;
  icon: React.ReactNode;
  iconBg: string;
  href?: string;
};

function StatCard({ label, value, icon, iconBg, href }: StatCardProps) {
  const content = (
    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          {value === null ? (
            <Loader2 className="w-6 h-6 animate-spin text-slate-400 mt-2" />
          ) : (
            <p className="mt-1 text-3xl font-bold text-slate-900">{value.toLocaleString()}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl shrink-0 ${iconBg}`}>{icon}</div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    );
  }

  return content;
}

const quickLinks = [
  {
    href: "/admin/appointments",
    label: "Appointments",
    description: "View and manage bookings",
    icon: CalendarDays,
    color: "bg-blue-50 text-blue-600",
  },
  {
    href: "/admin/treatments",
    label: "Treatments",
    description: "Add or edit services",
    icon: Stethoscope,
    color: "bg-brand-50 text-brand-600",
  },
  {
    href: "/admin/seo",
    label: "Manage SEO",
    description: "Meta title, description & keywords",
    icon: Globe,
    color: "bg-violet-50 text-violet-600",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    description: "Custom key-value configuration",
    icon: Settings,
    color: "bg-slate-100 text-slate-600",
  },
  {
    href: "/",
    label: "View Website",
    description: "Open the public site",
    icon: ExternalLink,
    color: "bg-slate-100 text-slate-600",
  },
];

export default function DashboardOverview() {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [treatments, setTreatments] = useState<Treatment[] | null>(null);
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      ApiMethod.get("/api/appointments"),
      ApiMethod.get("/api/treatments?all=true"),
      ApiMethod.get("/api/page-visits"),
    ]).then(([appointmentsRes, treatmentsRes, visitsRes]) => {
      if (appointmentsRes.success) setAppointments(appointmentsRes.data);
      else setAppointments([]);

      if (treatmentsRes.success) setTreatments(treatmentsRes.data);
      else setTreatments([]);

      if (visitsRes.success) setVisitCount(visitsRes.data.count);
      else setVisitCount(0);
    });
  }, []);

  const totalAppointments = appointments?.length ?? null;
  const pendingCount = appointments?.filter((a) => a.status === "pending").length ?? null;
  const confirmedCount = appointments?.filter((a) => a.status === "confirmed").length ?? null;
  const cancelledCount = appointments?.filter((a) => a.status === "cancelled").length ?? null;
  const activeTreatments = treatments?.filter((t) => t.isActive).length ?? null;
  const recentAppointments = appointments?.slice(0, 5) ?? [];

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <p className="text-sm font-semibold text-brand-600">{today}</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-500">
          Overview of appointments, treatments, and website activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Appointments"
          value={totalAppointments}
          href="/admin/appointments"
          icon={<CalendarDays className="w-6 h-6" />}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          href="/admin/appointments"
          icon={<Clock className="w-6 h-6" />}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Active Treatments"
          value={activeTreatments}
          href="/admin/treatments"
          icon={<Stethoscope className="w-6 h-6" />}
          iconBg="bg-brand-50 text-brand-600"
        />
        <StatCard
          label="Page Visits"
          value={visitCount}
          icon={<Eye className="w-6 h-6" />}
          iconBg="bg-violet-50 text-violet-600"
        />
      </div>

      {appointments !== null && totalAppointments !== null && totalAppointments > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            <Clock className="w-3.5 h-3.5" />
            {pendingCount} pending
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {confirmedCount} confirmed
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            <XCircle className="w-3.5 h-3.5" />
            {cancelledCount} cancelled
          </span>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Appointments</h2>
              <p className="text-sm text-slate-500">Latest booking requests</p>
            </div>
            <Link
              href="/admin/appointments"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {appointments === null ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : recentAppointments.length === 0 ? (
            <div className="text-center py-16 px-4">
              <CalendarDays className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="mt-3 text-slate-500 font-medium">No appointments yet</p>
              <p className="mt-1 text-sm text-slate-400">
                New bookings from the website will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{appointment.name}</p>
                    <p className="text-sm text-slate-500 truncate">
                      {appointment.preferredTreatment?.name ?? "No treatment"} ·{" "}
                      {formatDate(appointment.preferredDate)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                      statusStyles[appointment.status ?? "pending"]
                    }`}
                  >
                    {appointment.status ?? "pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 px-1">Quick Actions</h2>
          {quickLinks.map(({ href, label, description, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all"
            >
              <div className={`p-3 rounded-xl shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
                  {label}
                </p>
                <p className="text-sm text-slate-500 truncate">{description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
