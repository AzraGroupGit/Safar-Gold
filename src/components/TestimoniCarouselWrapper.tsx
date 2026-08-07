"use client";

import dynamic from "next/dynamic";

const ReviewsCarousel = dynamic(() => import("@/components/ReviewsCarousel"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  ),
});

export default function TestimoniCarouselWrapper({ widgetId }: { widgetId: string }) {
  return <ReviewsCarousel widgetId={widgetId} />;
}
