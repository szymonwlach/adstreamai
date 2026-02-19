// components/ReviewsSection.tsx
"use client";
import { useState, useEffect } from "react";
import { Star, StarHalf, VerifiedIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  user_name: string | null;
  user_avatar: string | null;
  rating: number;
  title: string;
  content: string;
  is_verified: boolean;
  created_at: string;
}

interface ReviewsData {
  reviews: Review[];
  total: number;
  average_rating: number;
  has_more: boolean;
}

export const ReviewsSection = () => {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    loadReviews();
  }, [page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/reviews?limit=${limit}&offset=${page * limit}`,
      );

      // Check if response is ok
      if (!response.ok) {
        console.error(
          "API response not OK:",
          response.status,
          response.statusText,
        );
        throw new Error(`API error: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("API returned non-JSON:", text);
        throw new Error("API did not return JSON");
      }

      const data = await response.json();
      setReviewsData(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
      // Set empty state on error
      setReviewsData({
        reviews: [],
        total: 0,
        average_rating: 0,
        has_more: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClass = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    }[size];

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star
            key={i}
            className={`${sizeClass} fill-yellow-400 text-yellow-400`}
          />,
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <StarHalf
            key={i}
            className={`${sizeClass} fill-yellow-400 text-yellow-400`}
          />,
        );
      } else {
        stars.push(<Star key={i} className={`${sizeClass} text-gray-300`} />);
      }
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading && !reviewsData) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Loading reviews...</p>
      </div>
    );
  }

  if (!reviewsData || reviewsData.reviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          No reviews yet. Be the first to review!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall Rating */}
      <div className="text-center space-y-4">
        <div className="inline-flex flex-col items-center space-y-2">
          <div className="text-5xl font-bold">
            {reviewsData.average_rating.toFixed(1)}
          </div>
          {renderStars(reviewsData.average_rating, "lg")}
          <p className="text-sm text-muted-foreground">
            Based on {reviewsData.total} review
            {reviewsData.total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid gap-6 md:grid-cols-2">
        {reviewsData.reviews.map((review) => (
          <Card key={review.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={review.user_avatar || undefined}
                      alt={review.user_name || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white">
                      {getInitials(review.user_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">
                        {review.user_name || "Anonymous User"}
                      </p>
                      {review.is_verified && (
                        <Badge
                          variant="secondary"
                          className="h-5 text-xs gap-1 bg-blue-50 text-blue-700 border-blue-200"
                        >
                          <VerifiedIcon className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    {renderStars(review.rating, "sm")}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(review.created_at)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <h3 className="font-semibold text-base">{review.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {reviewsData.has_more && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Reviews"}
          </Button>
        </div>
      )}
    </div>
  );
};
