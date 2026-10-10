"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import ApiMethod from "@/services/api-method";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await ApiMethod.post("/api/auth/logout", {});
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Log out
    </button>
  );
}
