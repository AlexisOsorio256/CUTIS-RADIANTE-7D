"use client";

import { useEffect } from "react";

/** Registra una visita por sesión de navegador. Invisible. */
export default function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("cr7d_visit")) return;
      sessionStorage.setItem("cr7d_visit", "1");
    } catch {
      return;
    }
    fetch("/api/visit", { method: "POST" }).catch(() => {});
  }, []);
  return null;
}
