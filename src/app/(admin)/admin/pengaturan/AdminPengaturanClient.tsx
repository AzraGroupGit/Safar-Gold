"use client";

import { useState } from "react";
import type { GoldTypeRow } from "@/lib/gold-api";

export default function AdminPengaturanClient({
  goldTypes: initialGoldTypes,
  settings: initialSettings,
}: {
  goldTypes: GoldTypeRow[];
  settings: Record<string, string>;
}) {
  const [goldTypes] = useState(initialGoldTypes);
  const [settings, setSettings] = useState({
    apiKey: initialSettings.api_key ?? "",
    usdIdrRate: initialSettings.usd_idr_rate ?? "16300",
    phone: initialSettings.phone ?? "",
    email: initialSettings.email ?? "",
    address: initialSettings.address ?? "",
    weekdayOpen: initialSettings.weekday_open ?? "09:00",
    weekdayClose: initialSettings.weekday_close ?? "17:00",
    saturdayOpen: initialSettings.saturday_open ?? "09:00",
    saturdayClose: initialSettings.saturday_close ?? "14:00",
  });
  const [margins, setMargins] = useState<Record<string, { buy: number; sell: number }>>(
    Object.fromEntries(goldTypes.map((g) => [g.id, { buy: g.margin_buy, sell: g.margin_sell }]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSettingChange = (field: string, value: string) => setSettings({ ...settings, [field]: value });
  const handleMarginChange = (id: string, type: "buy" | "sell", value: number) =>
    setMargins({ ...margins, [id]: { ...margins[id], [type]: value } });

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/update-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        margins,
        settings: {
          api_key: settings.apiKey,
          usd_idr_rate: settings.usdIdrRate,
          phone: settings.phone,
          email: settings.email,
          address: settings.address,
          weekday_open: settings.weekdayOpen,
          weekday_close: settings.weekdayClose,
          saturday_open: settings.saturdayOpen,
          saturday_close: settings.saturdayClose,
        },
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const lastUpdate = initialSettings.last_price_update
    ? new Date(initialSettings.last_price_update).toLocaleString("id-ID")
    : "Belum pernah";

  const fieldClass = "w-full rounded-xl border border-border/60 bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10";

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text">Pengaturan</h1>
        <p className="mt-1 text-sm text-text-muted">Konfigurasi API, margin, kontak, dan jam operasional</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
          <h3 className="mb-1 font-serif text-lg font-semibold text-text">API Harga Emas</h3>
          <p className="mb-5 text-xs text-text-muted">Terakhir update: {lastUpdate} · Cron: 06:00 WIB</p>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-text">GoldAPI Key</label>
              <input type="password" value={settings.apiKey} onChange={(e) => handleSettingChange("apiKey", e.target.value)} placeholder="goldapi-xxxxxxxxxxxx" className={fieldClass} />
              <p className="mt-1.5 text-xs text-text-light">
                Daftar gratis di <a href="https://www.goldapi.io" className="text-gold hover:underline" target="_blank" rel="noopener">goldapi.io</a>. Kosongkan untuk fallback CoinGecko.
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-text">Rate USD/IDR Manual</label>
              <input type="number" value={settings.usdIdrRate} onChange={(e) => handleSettingChange("usdIdrRate", e.target.value)} className={fieldClass} />
              <p className="mt-1.5 text-xs text-text-light">Otomatis ter-update jika GoldAPI tersedia.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
          <h3 className="mb-5 font-serif text-lg font-semibold text-text">Informasi Kontak</h3>
          <div className="space-y-4">
            {[
              { label: "Nomor Telepon", field: "phone", type: "text" },
              { label: "Email", field: "email", type: "email" },
              { label: "Alamat", field: "address", type: "text" },
            ].map((item) => (
              <div key={item.field}>
                <label className="mb-2 block text-sm font-semibold text-text">{item.label}</label>
                <input type={item.type} value={settings[item.field as keyof typeof settings]} onChange={(e) => handleSettingChange(item.field, e.target.value)} className={fieldClass} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
          <h3 className="mb-5 font-serif text-lg font-semibold text-text">Jam Operasional</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">Senin-Jumat Buka</label>
                <input type="time" value={settings.weekdayOpen} onChange={(e) => handleSettingChange("weekdayOpen", e.target.value)} className={fieldClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">Senin-Jumat Tutup</label>
                <input type="time" value={settings.weekdayClose} onChange={(e) => handleSettingChange("weekdayClose", e.target.value)} className={fieldClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">Sabtu Buka</label>
                <input type="time" value={settings.saturdayOpen} onChange={(e) => handleSettingChange("saturdayOpen", e.target.value)} className={fieldClass} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">Sabtu Tutup</label>
                <input type="time" value={settings.saturdayClose} onChange={(e) => handleSettingChange("saturdayClose", e.target.value)} className={fieldClass} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
          <h3 className="mb-1 font-serif text-lg font-semibold text-text">Margin per Jenis Emas (%)</h3>
          <p className="mb-5 text-xs text-text-muted">Jual = base + marginBuy% · Buyback = base - marginSell%</p>
          <div className="space-y-3">
            {goldTypes.map((gt) => (
              <div key={gt.id} className="rounded-xl border border-border/40 bg-surface p-4">
                <p className="mb-3 text-sm font-semibold text-text">{gt.name}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Margin Jual (+%)</label>
                    <input type="number" step="0.1" value={margins[gt.id]?.buy ?? gt.margin_buy} onChange={(e) => handleMarginChange(gt.id, "buy", parseFloat(e.target.value) || 0)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2 text-sm text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Margin Buyback (-%)</label>
                    <input type="number" step="0.1" value={margins[gt.id]?.sell ?? gt.margin_sell} onChange={(e) => handleMarginChange(gt.id, "sell", parseFloat(e.target.value) || 0)} className="w-full rounded-lg border border-border/60 bg-white px-3 py-2 text-sm text-text focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button onClick={handleSave} disabled={saving} className="gold-gradient-bg rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:shadow-lg hover:shadow-gold/30 disabled:opacity-50">
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
        {saved && <span className="text-sm font-medium text-green-600">Tersimpan!</span>}
      </div>
    </div>
  );
}
