"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Eye,
  Plus,
  Clock,
  Send,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Archive,
  TrendingUp,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DashboardNavbar } from "@/components/dashboardPage/DashboardNavbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Video {
  id: string;
  project_id: string;
  style: string;
  video_url?: string;
  created_at: string;
  quality?: string;
  duration?: number;
  language?: string;
  status?: "processing" | "ready" | "failed";
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  product_image_url: string;
  videos_generated: number;
  max_videos: number | null;
  total_views: number;
  total_likes: number;
  total_shares: number;
  created_at: string;
  videos?: Video[];
  projects?: any[];
}

const MyContent = () => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignName, setCampaignName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(
    new Set()
  );
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [previewVideo, setPreviewVideo] = useState<any>(null);
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>(
    {}
  );
  const [useMockData, setUseMockData] = useState(false);

  const connectedPlatforms = ["tiktok", "instagram"];

  const platforms = [
    { id: "tiktok", name: "TikTok", icon: "🎵", color: "bg-pink-500" },
    { id: "instagram", name: "Instagram", icon: "📸", color: "bg-purple-500" },
    { id: "facebook", name: "Facebook", icon: "👥", color: "bg-blue-500" },
    { id: "youtube", name: "YouTube Shorts", icon: "▶️", color: "bg-red-500" },
    { id: "linkedin", name: "LinkedIn", icon: "💼", color: "bg-blue-700" },
  ];

  const styleMapping: Record<
    string,
    {
      name: string;
      icon: string;
      badgeBg: string;
      borderColor: string;
      bgGradient: string;
    }
  > = {
    ugc: {
      name: "UGC Style",
      icon: "👤",
      badgeBg: "bg-blue-500 text-white",
      borderColor: "border-blue-500/30 hover:border-blue-500/60",
      bgGradient: "from-blue-500/20 to-blue-600/20",
    },
    trend: {
      name: "Trending",
      icon: "🔥",
      badgeBg: "bg-red-500 text-white",
      borderColor: "border-red-500/30 hover:border-red-500/60",
      bgGradient: "from-red-500/20 to-orange-600/20",
    },
    educational: {
      name: "Educational",
      icon: "🎓",
      badgeBg: "bg-purple-500 text-white",
      borderColor: "border-purple-500/30 hover:border-purple-500/60",
      bgGradient: "from-purple-500/20 to-indigo-600/20",
    },
    testimonial: {
      name: "Testimonial",
      icon: "⭐",
      badgeBg: "bg-yellow-500 text-black",
      borderColor: "border-yellow-500/30 hover:border-yellow-500/60",
      bgGradient: "from-yellow-500/20 to-amber-600/20",
    },
  };

  // Generate unique color for each video based on index
  const getVideoColorScheme = (index: number) => {
    const colorSchemes = [
      {
        bg: "from-blue-500 to-cyan-500",
        text: "text-white",
        num: "bg-blue-600",
      },
      {
        bg: "from-purple-500 to-pink-500",
        text: "text-white",
        num: "bg-purple-600",
      },
      {
        bg: "from-orange-500 to-red-500",
        text: "text-white",
        num: "bg-orange-600",
      },
      {
        bg: "from-green-500 to-teal-500",
        text: "text-white",
        num: "bg-green-600",
      },
      {
        bg: "from-indigo-500 to-blue-500",
        text: "text-white",
        num: "bg-indigo-600",
      },
      {
        bg: "from-rose-500 to-orange-500",
        text: "text-white",
        num: "bg-rose-600",
      },
      {
        bg: "from-cyan-500 to-blue-500",
        text: "text-white",
        num: "bg-cyan-600",
      },
      {
        bg: "from-lime-500 to-green-500",
        text: "text-white",
        num: "bg-lime-600",
      },
      {
        bg: "from-fuchsia-500 to-purple-500",
        text: "text-white",
        num: "bg-fuchsia-600",
      },
      { bg: "from-sky-500 to-blue-500", text: "text-white", num: "bg-sky-600" },
      {
        bg: "from-amber-500 to-orange-500",
        text: "text-white",
        num: "bg-amber-600",
      },
      {
        bg: "from-pink-500 to-rose-500",
        text: "text-white",
        num: "bg-pink-600",
      },
    ];
    return colorSchemes[index % colorSchemes.length];
  };

  // Generate unique pattern/icon for each video
  const getVideoIcon = (index: number) => {
    const icons = [
      "🎬",
      "🎥",
      "📹",
      "🎞️",
      "📺",
      "🎭",
      "🎪",
      "🎨",
      "✨",
      "🌟",
      "💫",
      "⭐",
    ];
    return icons[index % icons.length];
  };

  // Helper to get videos from campaign (supports both old projects and new videos format)
  const getVideosFromCampaign = (campaign: Campaign): Video[] => {
    if (campaign.videos && campaign.videos.length > 0) {
      return campaign.videos;
    }
    // Fallback: convert projects to videos if old format
    if (campaign.projects && campaign.projects.length > 0) {
      const allVideos: Video[] = [];
      campaign.projects.forEach((project: any) => {
        if (project.videos && project.videos.length > 0) {
          allVideos.push(
            ...project.videos.map((v: any) => ({
              ...v,
              quality: project.quality,
              duration: project.duration,
              language: project.language,
              status: project.status,
            }))
          );
        }
      });
      return allVideos;
    }
    return [];
  };
  // const getProductName =async  () => {
  // await fetch('getProductName', {
  //   method: 'POST',
  //   body: JSON.stringify({ campaignName }),
  // })
  // }
  // useEffect( () => {

  // }, []);
  const fetchCampaigns = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        console.error("No user session");
        setLoading(false);
        return;
      }

      console.log("📤 Fetching campaigns for user:", session.user.id);

      const response = await fetch(
        `/api/getCampaigns?user_id=${session.user.id}`
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ API error:", error);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("✅ Fetched campaigns:", data.campaigns);

      if (data.campaigns.length !== 0) {
        setCampaigns(data.campaigns);
      } else {
        setCampaigns([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching campaigns:", error);
      setCampaigns([]);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCampaigns();

    // Also fetch if user just returned from generate-ad page
    const params = new URLSearchParams(window.location.search);
    if (params.has("refresh")) {
      const timeout = setTimeout(() => fetchCampaigns(), 1000);
      return () => clearTimeout(timeout);
    }
  }, []);

  // Polling for processing videos
  useEffect(() => {
    if (useMockData) return;

    const hasProcessing = campaigns.some((c) =>
      getVideosFromCampaign(c).some((v) => v.status === "processing")
    );

    if (!hasProcessing) return;

    const interval = setInterval(() => {
      console.log("🔄 Checking for updates...");
      fetchCampaigns();
    }, 5000);

    return () => clearInterval(interval);
  }, [campaigns, useMockData]);

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        const updated = { ...prev };

        campaigns.forEach((campaign) => {
          getVideosFromCampaign(campaign).forEach((video) => {
            if (video.status === "processing") {
              const createdAt = new Date(video.created_at).getTime();
              const elapsed = Date.now() - createdAt;
              const seconds = elapsed / 1000;

              let progress = 0;
              if (seconds < 10) {
                progress = Math.min(30, seconds * 3);
              } else if (seconds < 40) {
                progress = 30 + Math.min(60, (seconds - 10) * 2);
              } else {
                progress = 90;
              }

              updated[video.id] = Math.round(progress);
            }
          });
        });

        return updated;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [campaigns]);

  const toggleCampaign = (campaignId: string) => {
    setExpandedCampaigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  const handleGenerateMore = (campaign: Campaign) => {
    router.push(
      `/dashboard/generate-ad?campaign_id=${campaign.id}&prefill=true`
    );
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePostNow = (videoId: string) => {
    setSelectedVideo(videoId);
    // Reset platform selection when opening post modal
    setSelectedPlatforms([]);
  };

  const handleConfirmPost = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    toast.success(`Video scheduled to post on ${selectedPlatforms.join(", ")}`);
    setSelectedVideo(null);
    setSelectedPlatforms([]);
  };

  // Calculate stats
  const totalVideos = campaigns.reduce(
    (sum, c) => sum + getVideosFromCampaign(c).length,
    0
  );

  // Count projects with 'processing' status as generating
  const processingCount = campaigns.reduce((sum, c) => {
    const projectsCount = (c.projects || []).filter(
      (p: any) => p.status === "processing"
    ).length;
    return sum + projectsCount;
  }, 0);

  const readyCount = campaigns.reduce(
    (sum, c) =>
      sum + getVideosFromCampaign(c).filter((v) => v.video_url).length,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="container mx-auto px-6 py-12 mt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your campaigns...</p>
          </div>
        </div>
      </div>
    );
  }
  {
    loading && campaigns.length === 0 && (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="p-6 border-border bg-card animate-pulse flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-muted rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-3 w-1/3 bg-muted rounded" />
                <div className="h-3 w-2/3 bg-muted rounded" />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="h-6 w-16 bg-muted rounded" />
              <div className="h-6 w-16 bg-muted rounded" />
              <div className="h-6 w-16 bg-muted rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="container mx-auto px-6 py-12 mt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">My Campaigns</h2>
            <p className="text-muted-foreground">
              Manage your product campaigns and AI-generated videos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push("/dashboard/generate-ad")}
              className="gap-2"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Total Campaigns
            </p>
            <p className="text-3xl font-bold">{campaigns.length}</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Total Videos</p>
            <p className="text-3xl font-bold">{totalVideos}</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Generating</p>
            <p className="text-3xl font-bold text-yellow-500">
              {processingCount}
            </p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Ready to Post</p>
            <p className="text-3xl font-bold text-blue-500">{readyCount}</p>
          </Card>
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const isExpanded = expandedCampaigns.has(campaign.id);
            const campaignVideos = getVideosFromCampaign(campaign);
            const processingVideos = campaignVideos.filter(
              (v) => v.status === "processing"
            );
            const readyVideos = campaignVideos.filter(
              (v) => v.status === "ready" && v.video_url
            );

            return (
              <Card
                key={campaign.id}
                className="bg-card border-border hover:border-primary transition-colors overflow-hidden"
              >
                {/* Campaign Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleCampaign(campaign.id)}
                >
                  <div className="flex gap-6">
                    {/* Thumbnail */}
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <img
                        src={campaign.product_image_url}
                        alt={campaign.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Campaign Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">
                              {campaign.name}
                            </h3>
                            <Badge variant="outline" className="gap-1">
                              <Sparkles className="w-3 h-3" />
                              {campaignVideos.length} videos
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                            {campaign.description &&
                            campaign.description.trim() !== "" ? (
                              campaign.description.slice(0, 100)
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3" />
                                <span className="italic">
                                  AI will generate description
                                </span>
                              </>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created{" "}
                            {new Date(campaign.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        {processingVideos.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-500" />
                            <span className="text-muted-foreground">
                              {processingVideos.length} generating
                            </span>
                          </div>
                        )}
                        {readyVideos.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-blue-500" />
                            <span className="text-muted-foreground">
                              {readyVideos.length} ready to post
                            </span>
                          </div>
                        )}
                        {campaign.max_videos && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">
                              {campaignVideos.length}/{campaign.max_videos}{" "}
                              limit
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content - Videos */}
                {isExpanded && (
                  <div className="border-t border-border bg-muted/20">
                    <div className="p-6 space-y-4">
                      {/* Generate More Button */}
                      <div className="flex justify-end mb-4">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateMore(campaign);
                          }}
                          variant="outline"
                          className="gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          Generate More Videos
                        </Button>
                      </div>

                      {/* Videos Grid */}
                      {campaignVideos.length > 0 ? (
                        <div className="space-y-3">
                          {campaignVideos.map((video, videoIndex) => {
                            const colorScheme = getVideoColorScheme(videoIndex);
                            const videoIcon = getVideoIcon(videoIndex);
                            return (
                              <Card
                                key={video.id}
                                className={`p-4 bg-card border-2 transition-all ${
                                  styleMapping[video.style]?.borderColor ||
                                  "border-border"
                                }`}
                              >
                                <div className="flex gap-4">
                                  {/* Video Preview */}
                                  <div
                                    className={`relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all bg-gradient-to-br ${colorScheme.bg}`}
                                    onClick={() =>
                                      setPreviewVideo({
                                        ...video,
                                        productName: campaign.name,
                                        thumbnail: campaign.product_image_url,
                                        styleName:
                                          styleMapping[video.style]?.name ||
                                          video.style,
                                        styleIcon:
                                          styleMapping[video.style]?.icon ||
                                          "🎬",
                                        videoNumber: videoIndex + 1,
                                        colorScheme: colorScheme,
                                      })
                                    }
                                  >
                                    {video.video_url ? (
                                      <video
                                        src={video.video_url}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-4xl opacity-70">
                                          {videoIcon}
                                        </span>
                                      </div>
                                    )}

                                    {/* HUGE NUMBER BADGE */}
                                    <div className="absolute bottom-1 left-1">
                                      <div
                                        className={`${colorScheme.num} text-white font-black px-2 py-1 rounded text-lg shadow-xl border-2 border-white`}
                                      >
                                        #{videoIndex + 1}
                                      </div>
                                    </div>

                                    {/* Dark overlay on bottom for number readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                                    {/* Style Icon Top Right */}
                                    <div className="absolute top-1 right-1 z-20">
                                      <Badge
                                        className={`text-xs font-bold ${
                                          styleMapping[video.style]?.badgeBg ||
                                          "bg-primary"
                                        }`}
                                      >
                                        {styleMapping[video.style]?.icon ||
                                          "🎬"}
                                      </Badge>
                                    </div>
                                  </div>

                                  {/* Video Info */}
                                  <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge
                                          className={`text-xs font-semibold ${
                                            video.status === "processing"
                                              ? "bg-yellow-500 text-black"
                                              : video.status === "ready"
                                              ? "bg-blue-500 text-white"
                                              : "bg-red-500 text-white"
                                          }`}
                                        >
                                          {video.status === "processing" &&
                                            "⏳ Generating"}
                                          {video.status === "ready" &&
                                            "✓ Ready"}
                                          {video.status === "failed" &&
                                            "✗ Failed"}
                                        </Badge>
                                        <Badge
                                          variant="outline"
                                          className={`gap-1 ${
                                            styleMapping[video.style]
                                              ?.borderColor
                                              ? styleMapping[video.style]
                                                  ?.badgeBg
                                              : ""
                                          }`}
                                        >
                                          <span>
                                            {styleMapping[video.style]?.icon ||
                                              "🎬"}
                                          </span>
                                          {styleMapping[video.style]?.name ||
                                            video.style}
                                        </Badge>
                                        <Badge className="bg-primary/20 text-primary gap-1">
                                          Video #{videoIndex + 1}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        {video.quality} • {video.duration}s •{" "}
                                        {video.language?.toUpperCase() || "EN"}{" "}
                                        •{" "}
                                        {new Date(
                                          video.created_at
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>

                                    {/* Status/Progress */}
                                    {video.status === "processing" && (
                                      <div className="mt-2">
                                        <div className="w-full bg-muted rounded-full h-1.5 mb-1">
                                          <div
                                            className="bg-primary h-1.5 rounded-full transition-all duration-500"
                                            style={{
                                              width: `${
                                                videoProgress[video.id] || 0
                                              }%`,
                                            }}
                                          />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          {videoProgress[video.id] || 0}%
                                          complete
                                        </p>
                                      </div>
                                    )}

                                    {/* Actions */}
                                    {video.status === "ready" &&
                                      video.video_url && (
                                        <div className="flex gap-2 mt-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-2 flex-1"
                                            onClick={() =>
                                              setPreviewVideo({
                                                ...video,
                                                productName: campaign.name,
                                                thumbnail:
                                                  campaign.product_image_url,
                                              })
                                            }
                                          >
                                            <Eye className="w-3 h-3" />
                                            Preview
                                          </Button>
                                          <Button
                                            size="sm"
                                            className="gap-2 flex-1"
                                            onClick={() =>
                                              handlePostNow(video.id)
                                            }
                                          >
                                            <Send className="w-3 h-3" />
                                            Post
                                          </Button>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No videos yet. Generate some to get started!
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {campaigns.length === 0 && (
          <Card className="p-12 text-center bg-card border-border border-dashed">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎬</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first campaign and start generating AI-powered video
                ads
              </p>
              <Button
                onClick={() => router.push("/dashboard/generate-ad")}
                size="lg"
                className="gap-2"
              >
                <Plus className="w-5 h-5" />
                Create First Campaign
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Preview Modal */}
      {previewVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewVideo(null)}
        >
          <Card
            className="max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">
                    {previewVideo.productName}
                  </h3>
                  <Badge className="bg-primary/20 text-primary">
                    Video #{previewVideo.videoNumber}
                  </Badge>
                </div>
                {previewVideo.styleName && (
                  <Badge variant="outline" className="gap-1 mt-2">
                    <span>{previewVideo.styleIcon}</span>
                    {previewVideo.styleName}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewVideo(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {previewVideo.video_url ? (
              <video
                src={previewVideo.video_url}
                controls
                autoPlay
                className="w-full rounded-lg"
              />
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative">
                {/* HUGE video number */}
                <div className="text-9xl font-black text-primary/30">
                  #{previewVideo.videoNumber}
                </div>

                {/* Processing text */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-muted-foreground font-medium">
                    Video is processing...
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPreviewVideo(null)}
              >
                Close
              </Button>
              {previewVideo.video_url && (
                <Button
                  className="flex-1 gap-2"
                  onClick={() => {
                    setPreviewVideo(null);
                    handlePostNow(previewVideo.id);
                  }}
                >
                  <Send className="w-4 h-4" />
                  Post This Video
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Post Now Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setSelectedVideo(null);
            setSelectedPlatforms([]);
          }}
        >
          <Card
            className="max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Select Platforms</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedVideo(null);
                  setSelectedPlatforms([]);
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Choose which platforms you want to post this video to
            </p>

            <div className="space-y-3 mb-6">
              {platforms.map((platform) => {
                const isConnected = connectedPlatforms.includes(platform.id);
                const isSelected = selectedPlatforms.includes(platform.id);

                return (
                  <div
                    key={platform.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    } ${!isConnected && "opacity-50"}`}
                    onClick={() => {
                      if (isConnected) {
                        togglePlatform(platform.id);
                      } else {
                        toast.error(
                          `Please connect your ${platform.name} account first`
                        );
                      }
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={!isConnected}
                      onCheckedChange={() => {
                        if (isConnected) {
                          togglePlatform(platform.id);
                        }
                      }}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="font-medium">{platform.name}</span>
                    </div>
                    {!isConnected && (
                      <Badge variant="outline" className="text-xs">
                        Not Connected
                      </Badge>
                    )}
                    {isConnected && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-500/10 text-green-500 border-green-500/20"
                      >
                        Connected
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedVideo(null);
                  setSelectedPlatforms([]);
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleConfirmPost}
                disabled={selectedPlatforms.length === 0}
              >
                <Send className="w-4 h-4" />
                Post Now
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MyContent;
