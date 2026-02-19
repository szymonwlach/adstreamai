// app/reviews/page.tsx
"use client";
import { useState } from "react";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ReviewForm } from "@/components/ReviewForm";

export default function ReviewsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewSubmitted = () => {
    // Refresh reviews after submission
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Customer <span className="text-gradient">Reviews</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            See what our users have to say about AdStreamAI
          </p>
          <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
        </div>

        {/* Reviews */}
        <ReviewsSection key={refreshKey} />
      </div>
    </div>
  );
}
