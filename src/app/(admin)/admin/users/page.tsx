import type { Metadata } from "next";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola User — Safar Gold Admin",
};

export default function UsersPage() {
  return <UsersClient />;
}
