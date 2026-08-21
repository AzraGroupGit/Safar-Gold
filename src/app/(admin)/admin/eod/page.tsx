import type { Metadata } from "next";
import EODClient from "./EODClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "EOD — Safar Gold Admin" };

export default function EODPage() {
  return <EODClient />;
}
