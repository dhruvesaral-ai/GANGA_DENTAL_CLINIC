"use client";

import { useEffect } from "react";
import ApiMethod from "@/services/api-method";

export default function PageVisitTracker() {
  useEffect(() => {
    ApiMethod.post("/api/page-visits", {}).catch(() => {});
  }, []);

  return null;
}
