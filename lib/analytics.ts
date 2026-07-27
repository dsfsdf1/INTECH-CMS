"use client";

declare global {
  interface Window {
    ym?: (counterId: number, method: string, target: string) => void;
    __intechMetrikaId?: number;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackLeadSubmission() {
  if (window.__intechMetrikaId) window.ym?.(window.__intechMetrikaId, "reachGoal", "lead_submit");
  window.gtag?.("event", "generate_lead", { event_category: "form" });
  window.fbq?.("track", "Lead");
}
