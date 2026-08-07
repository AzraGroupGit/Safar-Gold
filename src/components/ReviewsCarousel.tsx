"use client";

import { ReactGoogleReviews } from "react-google-reviews";
import "react-google-reviews/dist/index.css";

export default function ReviewsCarousel({ widgetId }: { widgetId: string }) {
  const id = widgetId && widgetId !== "example" ? widgetId : "example";

  return (
    <ReactGoogleReviews
      layout="carousel"
      featurableId={id}
      theme="light"
      maxItems={3}
      carouselAutoplay
      carouselSpeed={5000}
      showDots
      hideEmptyReviews
      nameDisplay="firstAndLastInitials"
      dateDisplay="relative"
      reviewVariant="card"
    />
  );
}
