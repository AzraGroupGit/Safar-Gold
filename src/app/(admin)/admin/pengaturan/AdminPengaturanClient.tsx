"use client";

import { useState } from "react";

export default function AdminPengaturanClient({
  settings: initialSettings,
}: {
  settings: Record<string, string>;
}) {
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
    googleReviewsWidgetId: initialSettings.google_reviews_widget_id ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSettingChange = (field: string, value: string) =>
    setSettings({ ...settings, [field]: value });

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/update-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
          google_reviews_widget_id: settings.googleReviewsWidgetId,
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

  const fieldClass =
    "w-full rounded-lg border border-border/60 bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-light focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30";

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text">Pengaturan</h1>
        <p className="mt-1 text-sm text-text-muted">
          Konfigurasi API, margin, kontak, dan jam operasional
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-white p-6">
          <h3 className="mb-1 font-serif text-lg font-semibold text-text">
            API Harga Emas
          </h3>
          <p className="mb-5 text-xs text-text-muted">
            Terakhir update: {lastUpdate} · Cron: 06:00 WIB
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-text">
                MetalpriceAPI Key
              </label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => handleSettingChange("apiKey", e.target.value)}
                placeholder="xxxxxxxxxxxxxxxxxxxx"
                className={fieldClass}
              />
              <p className="mt-1.5 text-xs text-text-light">
                Daftar gratis di{" "}
                <a
                  href="https://metalpriceapi.com"
                  className="text-gold hover:underline"
                  target="_blank"
                  rel="noopener"
                >
                  metalpriceapi.com
                </a>
                . Mendukung XAU, XAG, XPD, dan IDR dalam 1 call.
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-text">
                Rate USD/IDR Manual
              </label>
              <input
                type="number"
                value={settings.usdIdrRate}
                onChange={(e) =>
                  handleSettingChange("usdIdrRate", e.target.value)
                }
                className={fieldClass}
              />
              <p className="mt-1.5 text-xs text-text-light">
                Otomatis ter-update jika data API tersedia.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-white p-6">
          <h3 className="mb-5 font-serif text-lg font-semibold text-text">
            Informasi Kontak
          </h3>
          <div className="space-y-4">
            {[
              { label: "Nomor Telepon", field: "phone", type: "text" },
              { label: "Email", field: "email", type: "email" },
              { label: "Alamat", field: "address", type: "text" },
            ].map((item) => (
              <div key={item.field}>
                <label className="mb-2 block text-sm font-semibold text-text">
                  {item.label}
                </label>
                <input
                  type={item.type}
                  value={settings[item.field as keyof typeof settings]}
                  onChange={(e) =>
                    handleSettingChange(item.field, e.target.value)
                  }
                  className={fieldClass}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-white p-6">
          <h3 className="mb-5 font-serif text-lg font-semibold text-text">
            Jam Operasional
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Senin-Jumat Buka
                </label>
                <input
                  type="time"
                  value={settings.weekdayOpen}
                  onChange={(e) =>
                    handleSettingChange("weekdayOpen", e.target.value)
                  }
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Senin-Jumat Tutup
                </label>
                <input
                  type="time"
                  value={settings.weekdayClose}
                  onChange={(e) =>
                    handleSettingChange("weekdayClose", e.target.value)
                  }
                  className={fieldClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Sabtu Buka
                </label>
                <input
                  type="time"
                  value={settings.saturdayOpen}
                  onChange={(e) =>
                    handleSettingChange("saturdayOpen", e.target.value)
                  }
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Sabtu Tutup
                </label>
                <input
                  type="time"
                  value={settings.saturdayClose}
                  onChange={(e) =>
                    handleSettingChange("saturdayClose", e.target.value)
                  }
                  className={fieldClass}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border/60 bg-white p-6">
          <h3 className="mb-5 font-serif text-lg font-semibold text-text">
            Google Reviews
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-text">
                Widget ID (Featurable)
              </label>
              <input
                type="text"
                value={settings.googleReviewsWidgetId}
                onChange={(e) =>
                  handleSettingChange("googleReviewsWidgetId", e.target.value)
                }
                placeholder="contoh: 60f51fb8-..."
                className={`${fieldClass} font-mono`}
              />
              <p className="mt-1.5 text-xs text-text-light">
                Dari Featurable dashboard → Embed → API. Digunakan di section
                testimoni website.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
        {saved && (
          <span className="text-sm font-medium text-green-600">Tersimpan!</span>
        )}
      </div>
    </div>
  );
}
