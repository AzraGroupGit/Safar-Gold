import { getAllGoldTypes } from "@/lib/gold-api";
import JenisEmasClient from "./JenisEmasClient";

export const dynamic = "force-dynamic";

export default async function JenisEmasPage() {
  const goldTypes = await getAllGoldTypes();
  return <JenisEmasClient goldTypes={goldTypes} />;
}
