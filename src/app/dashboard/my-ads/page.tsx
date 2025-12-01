"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Eye,
  Plus,
  Clock,
  Send,
  Link2,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardNavbar } from "@/components/dashboardPage/DashboardNavbar";

const MyContent = () => {
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState<number | null>(
    null
  );
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  // Mock data - w prawdziwej apce z bazy danych
  const connectedPlatforms = ["tiktok", "instagram"]; // Platformy połączone przez usera

  const platforms = [
    { id: "tiktok", name: "TikTok", icon: "🎵", color: "bg-pink-500" },
    { id: "instagram", name: "Instagram", icon: "📸", color: "bg-purple-500" },
    { id: "facebook", name: "Facebook", icon: "👥", color: "bg-blue-500" },
    { id: "youtube", name: "YouTube Shorts", icon: "▶️", color: "bg-red-500" },
    { id: "linkedin", name: "LinkedIn", icon: "💼", color: "bg-blue-700" },
  ];

  const mockVideos = [
    {
      id: 1,
      productName: "Wireless Headphones",
      style: "ugc",
      styleName: "UGC Style",
      styleIcon: "👤",
      thumbnail:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      status: "pending" as const,
      createdAt: "2024-01-15",
      postedTo: [],
      generatedAt: Date.now(), // Track when generation started
    },
    {
      id: 2,
      productName: "Wireless Headphones",
      style: "trend",
      styleName: "Trending",
      styleIcon: "🔥",
      thumbnail:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      status: "ready" as const,
      createdAt: "2024-01-15",
      postedTo: [],
    },
    {
      id: 3,
      productName: "Wireless Headphones",
      style: "educational",
      styleName: "Educational",
      styleIcon: "🎓",
      thumbnail:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      status: "posted" as const,
      createdAt: "2024-01-15",
      postedTo: ["tiktok", "instagram"],
      views: 12540,
    },
    {
      id: 4,
      productName: "Smart Watch",
      style: "educational",
      styleName: "Educational",
      styleIcon: "🎓",
      thumbnail:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      status: "scheduled" as const,
      createdAt: "2024-01-14",
      scheduledFor: "Tomorrow at 9:00 AM",
      postedTo: ["youtube"],
    },
  ];

  // Simulated progress for pending videos
  const [videoProgress, setVideoProgress] = React.useState<
    Record<number, number>
  >({});

  React.useEffect(() => {
    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        const updated = { ...prev };
        mockVideos
          .filter((v) => v.status === "pending")
          .forEach((video) => {
            const elapsed = Date.now() - (video.generatedAt || Date.now());
            const seconds = elapsed / 1000;

            // Simulate progress: fast to 30%, then slow to 90%, stays there
            let progress = 0;
            if (seconds < 5) {
              progress = Math.min(30, seconds * 6); // 0-30% in 5 seconds
            } else if (seconds < 20) {
              progress = 30 + Math.min(60, (seconds - 5) * 4); // 30-90% in 15 seconds
            } else {
              progress = 90; // Stay at 90% until backend confirms ready
            }

            updated[video.id] = Math.round(progress);
          });
        return updated;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePostNow = (videoId: number) => {
    setSelectedVideo(videoId);
    // Modal logic here
  };

  const stats = {
    totalVideos: mockVideos.length,
    pending: mockVideos.filter((v) => v.status === "pending").length,
    ready: mockVideos.filter((v) => v.status === "ready").length,
    posted: mockVideos.filter((v) => v.status === "posted").length,
    scheduled: mockVideos.filter((v) => v.status === "scheduled").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="container mx-auto px-6 py-12 mt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">My Content</h2>
            <p className="text-muted-foreground">
              Manage your AI-generated videos
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/generate-ad")}
            className="gap-2"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Generate New Videos
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Total Videos</p>
            <p className="text-3xl font-bold">{stats.totalVideos}</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Generating</p>
            <p className="text-3xl font-bold text-yellow-500">
              {stats.pending}
            </p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Ready to Post</p>
            <p className="text-3xl font-bold text-blue-500">{stats.ready}</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Posted</p>
            <p className="text-3xl font-bold text-green-500">{stats.posted}</p>
          </Card>
        </div>

        {/* Videos List */}
        <div className="space-y-4">
          {mockVideos.map((video) => (
            <Card
              key={video.id}
              className="p-6 bg-card border-border hover:border-primary transition-colors"
            >
              <div className="flex gap-6">
                {/* Thumbnail */}
                <div className="relative w-32 h-32 flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.productName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge
                      className={`text-xs font-semibold ${
                        video.status === "pending"
                          ? "bg-yellow-500 text-black border-yellow-600"
                          : video.status === "ready"
                          ? "bg-blue-500 text-white border-blue-600"
                          : video.status === "posted"
                          ? "bg-green-500 text-white border-green-600"
                          : "bg-purple-500 text-white border-purple-600"
                      }`}
                    >
                      {video.status === "pending" && "⏳ Generating"}
                      {video.status === "ready" && "✓ Ready"}
                      {video.status === "posted" && "✓ Posted"}
                      {video.status === "scheduled" && "📅 Scheduled"}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">
                          {video.productName}
                        </h3>
                        <Badge variant="outline" className="gap-1">
                          <span>{video.styleIcon}</span>
                          {video.styleName}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created {video.createdAt}
                        {video.status === "scheduled" &&
                          ` • Scheduled for ${video.scheduledFor}`}
                      </p>
                    </div>
                  </div>

                  {/* Posted platforms or Ready to post */}
                  {video.status === "pending" && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        AI is generating your video...
                      </p>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${videoProgress[video.id] || 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {videoProgress[video.id] || 0}% complete
                      </p>
                    </div>
                  )}

                  {video.status === "posted" && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Posted on:
                      </p>
                      <div className="flex gap-2">
                        {video.postedTo?.map((platformId) => {
                          const platform = platforms.find(
                            (p) => p.id === platformId
                          );
                          return (
                            <Badge key={platformId} variant="outline">
                              <span className="mr-1">{platform?.icon}</span>
                              {platform?.name}
                            </Badge>
                          );
                        })}
                      </div>
                      {video.views && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {video.views.toLocaleString()} views
                        </p>
                      )}
                    </div>
                  )}

                  {video.status === "scheduled" && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Will post to:
                      </p>
                      <div className="flex gap-2">
                        {video.postedTo?.map((platformId) => {
                          const platform = platforms.find(
                            (p) => p.id === platformId
                          );
                          return (
                            <Badge
                              key={platformId}
                              variant="outline"
                              className="gap-1"
                            >
                              <Clock className="w-3 h-3" />
                              <span>{platform?.icon}</span>
                              {platform?.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {video.status === "ready" && (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        📌 This video is ready to post! Choose platforms below.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {video.status === "pending" ? (
                      <Button size="sm" variant="outline" disabled>
                        <Clock className="w-4 h-4 mr-2" />
                        Generating...
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="w-4 h-4" />
                          Preview
                        </Button>

                        {video.status === "ready" && (
                          <>
                            {connectedPlatforms.length === 0 ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  router.push("/dashboard#connect")
                                }
                                className="gap-2"
                              >
                                <Link2 className="w-4 h-4" />
                                Connect Accounts First
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handlePostNow(video.id)}
                                className="gap-2"
                              >
                                <Send className="w-4 h-4" />
                                Post Now
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                              onClick={() => setShowScheduleModal(video.id)}
                            >
                              <Calendar className="w-4 h-4" />
                              Schedule
                            </Button>
                          </>
                        )}

                        {video.status === "scheduled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => setShowScheduleModal(video.id)}
                          >
                            <Calendar className="w-4 h-4" />
                            Edit Schedule
                          </Button>
                        )}

                        {video.status === "posted" && (
                          <Button size="sm" variant="outline" className="gap-2">
                            <Eye className="w-4 h-4" />
                            View Analytics
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule Modal */}
              {showScheduleModal === video.id && video.status === "ready" && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Schedule Post</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowScheduleModal(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4 mb-4">
                    <div>
                      <Label
                        htmlFor="schedule-date"
                        className="text-sm mb-2 block"
                      >
                        Date
                      </Label>
                      <Input
                        id="schedule-date"
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="schedule-time"
                        className="text-sm mb-2 block"
                      >
                        Time
                      </Label>
                      <Input
                        id="schedule-time"
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="text-sm mb-3 block">
                        Select platforms to schedule
                      </Label>
                      <div className="space-y-2">
                        {platforms
                          .filter((p) => connectedPlatforms.includes(p.id))
                          .map((platform) => {
                            const isSelected = selectedPlatforms.includes(
                              platform.id
                            );
                            return (
                              <div
                                key={platform.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-border"
                                }`}
                                onClick={() => togglePlatform(platform.id)}
                              >
                                <Checkbox checked={isSelected} />
                                <div
                                  className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center text-lg`}
                                >
                                  {platform.icon}
                                </div>
                                <span className="font-medium">
                                  {platform.name}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowScheduleModal(null);
                        setScheduleDate("");
                        setScheduleTime("");
                        setSelectedPlatforms([]);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={
                        !scheduleDate ||
                        !scheduleTime ||
                        selectedPlatforms.length === 0
                      }
                      className="flex-1 gap-2"
                      onClick={() => {
                        // Handle schedule logic here
                        console.log("Scheduled:", {
                          scheduleDate,
                          scheduleTime,
                          platforms: selectedPlatforms,
                        });
                        setShowScheduleModal(null);
                        setScheduleDate("");
                        setScheduleTime("");
                        setSelectedPlatforms([]);
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Post
                    </Button>
                  </div>
                </div>
              )}

              {/* Post Now Modal Content (shown when selectedVideo === video.id) */}
              {selectedVideo === video.id && video.status === "ready" && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-semibold mb-4">
                    Select platforms to post:
                  </h4>

                  {/* Info about connecting more platforms */}
                  {connectedPlatforms.length < platforms.length && (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">💡</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                            Want to post to more platforms?
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            You have {connectedPlatforms.length} of{" "}
                            {platforms.length} platforms connected.{" "}
                            <span
                              className="text-primary cursor-pointer hover:underline font-medium"
                              onClick={() => {
                                setSelectedVideo(null);
                                router.push("/dashboard#connect");
                              }}
                            >
                              Connect more accounts
                            </span>{" "}
                            to reach a wider audience.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 mb-4">
                    {platforms
                      .filter((p) => connectedPlatforms.includes(p.id))
                      .map((platform) => {
                        const isSelected = selectedPlatforms.includes(
                          platform.id
                        );
                        return (
                          <Card
                            key={platform.id}
                            className={`p-4 cursor-pointer transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary"
                            }`}
                            onClick={() => togglePlatform(platform.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-xl`}
                                >
                                  {platform.icon}
                                </div>
                                <div>
                                  <h5 className="font-semibold">
                                    {platform.name}
                                  </h5>
                                  <p className="text-xs text-muted-foreground">
                                    Connected
                                  </p>
                                </div>
                              </div>
                              <Checkbox checked={isSelected} />
                            </div>
                          </Card>
                        );
                      })}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedVideo(null);
                        setSelectedPlatforms([]);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={selectedPlatforms.length === 0}
                      className="flex-1 gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Post to {selectedPlatforms.length} platform
                      {selectedPlatforms.length !== 1 ? "s" : ""}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockVideos.length === 0 && (
          <Card className="p-12 text-center bg-card border-border border-dashed">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎬</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">No videos yet</h3>
              <p className="text-muted-foreground mb-6">
                Generate your first AI-powered video ad to get started
              </p>
              <Button
                onClick={() => router.push("/dashboard/generate-ad")}
                size="lg"
                className="gap-2"
              >
                <Plus className="w-5 h-5" />
                Generate First Video
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyContent;
