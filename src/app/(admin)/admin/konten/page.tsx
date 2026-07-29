import { getHeroContent } from "@/lib/gold-api";
import AdminKontenClient from "./AdminKontenClient";

export default async function AdminKontenPage() {
  const hero = await getHeroContent();
  return <AdminKontenClient initial={hero} />;
}
