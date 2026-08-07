import { getSetting } from "@/lib/gold-api";
import TestimoniCarouselWrapper from "@/components/TestimoniCarouselWrapper";

export default async function Testimoni() {
  const widgetId = (await getSetting("google_reviews_widget_id")) || "example";

  return (
    <section className="relative overflow-hidden bg-surface px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <span className="pointer-events-none absolute -left-8 -top-8 select-none font-serif text-[14rem] font-bold leading-none text-gold/[0.04]">
        03
      </span>
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Testimoni</p>
          <h2 className="font-serif text-2xl font-bold text-text md:text-4xl lg:text-5xl">Dipercaya Pelanggan</h2>
          <p className="mx-auto mt-5 max-w-xl text-text-muted">Review asli dari pelanggan kami di Google Maps.</p>
        </div>
        <TestimoniCarouselWrapper widgetId={widgetId} />
      </div>
    </section>
  );
}
