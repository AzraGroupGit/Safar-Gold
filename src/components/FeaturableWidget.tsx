"use client";

import Script from "next/script";

export default function FeaturableWidget({ widgetId }: { widgetId: string }) {
  if (!widgetId || widgetId === "example") {
    return (
      <p className="text-center text-sm text-text-muted py-12">
        Widget ID belum dikonfigurasi. Silakan atur di admin dashboard.
      </p>
    );
  }

  return (
    <>
      <div
        id={`featurable-${widgetId}`}
        data-featurable-async
        className="min-h-[200px] [&_iframe]:w-full [&_iframe]:rounded-2xl"
      />
      <Script
        src="https://cdn.featurable.com/widget/v2/embed.js"
        strategy="afterInteractive"
      />
    </>
  );
}
