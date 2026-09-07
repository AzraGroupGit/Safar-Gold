import type { Metadata } from "next";
import { Suspense } from "react";
import AnalyticsClient from "./AnalyticsClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Analitik — Safar Gold Admin" };

export default function AnalyticsPage() {
  return <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-white" aria-label="Memuat analitik" />}><AnalyticsClient /></Suspense>;
}
