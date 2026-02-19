// components/ReviewForm.tsx
"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface ReviewFormProps {
  onReviewSubmitted?: () => void;
}

interface UserProfile {
  display_name: string | null;
  avatar_url: string | null;
}

export const ReviewForm = ({ onReviewSubmitted }: ReviewFormProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    display_name: null,
    avatar_url: null,
  });
  const [existingReview, setExistingReview] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.email!);
        checkExistingReview(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.email!);
        checkExistingReview(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (email: string) => {
    try {
      const response = await fetch(
        `/api/user/profile?email=${encodeURIComponent(email)}`,
      );
      if (response.ok) {
        const data = await response.json();
        setUserProfile({
          display_name: data.display_name,
          avatar_url: data.avatar_url,
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const checkExistingReview = async (userId: string) => {
    try {
      const response = await fetch(`/api/reviews/my-review?user_id=${userId}`);
      const data = await response.json();
      if (data.has_review) {
        setExistingReview(data.review);
        setRating(data.review.rating);
        setTitle(data.review.title);
        setContent(data.review.content);
      }
    } catch (error) {
      console.error("Error checking existing review:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      if (existingReview) {
        // Update existing review
        const response = await fetch(`/api/reviews/${existingReview.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            rating,
            title,
            content,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update review");
        }

        toast.success("Review updated successfully!");
      } else {
        // Create new review
        const response = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            user_email: user.email,
            user_name: userProfile.display_name,
            user_avatar: userProfile.avatar_url,
            rating,
            title,
            content,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to submit review");
        }

        toast.success("Review submitted successfully!");
      }

      setOpen(false);
      resetForm();
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview || !user) return;

    if (!confirm("Are you sure you want to delete your review?")) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/reviews/${existingReview.id}?user_id=${user.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      toast.success("Review deleted successfully!");
      setOpen(false);
      resetForm();
      setExistingReview(null);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (!existingReview) {
      setRating(0);
      setTitle("");
      setContent("");
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Please sign in to leave a review
        </p>
        <Button onClick={() => (window.location.href = "/auth")}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          {existingReview ? "Edit Your Review" : "Write a Review"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? "Edit Your Review" : "Write a Review"}
          </DialogTitle>
          <DialogDescription>
            Share your experience with AdStreamAI
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              placeholder="Summarize your experience"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/100 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Review *</Label>
            <Textarea
              id="content"
              placeholder="Tell us about your experience with AdStreamAI..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={1000}
              required
            />
            <p className="text-xs text-muted-foreground">
              {content.length}/1000 characters
            </p>
          </div>

          <div className="flex justify-between gap-3">
            {existingReview && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Review
              </Button>
            )}
            <div className="flex gap-3 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Submitting..."
                  : existingReview
                    ? "Update Review"
                    : "Submit Review"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
