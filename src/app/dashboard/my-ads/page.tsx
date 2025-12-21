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
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DashboardNavbar } from "@/components/dashboardPage/DashboardNavbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import CaptionEditorModal from "@/components/my-ads/CaptionEditModal";

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
  const [loading, setLoading] = useState(true);
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(
    new Set()
  );
  const [previewVideo, setPreviewVideo] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [selectedVideoForCaption, setSelectedVideoForCaption] =
    useState<any>(null);
  const [loadingCaptions, setLoadingCaptions] = useState(false);

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
      {
        bg: "from-sky-500 to-blue-500",
        text: "text-white",
        num: "bg-sky-600",
      },
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

  const getVideosFromCampaign = (campaign: Campaign): Video[] => {
    if (campaign.videos && campaign.videos.length > 0) {
      return campaign.videos;
    }
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

  const getProcessingProjects = (campaign: Campaign): any[] => {
    if (!campaign.projects) return [];
    return campaign.projects.filter((p: any) => p.status === "processing");
  };

  const fetchConnectedPlatforms = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        return;
      }
      setUserId(session.user.id);

      const response = await fetch(
        `/api/connections?userId=${session.user.id}`
      );
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      if (data.connections) {
        const platforms = data.connections.map((c: any) => c.platform);
        setConnectedPlatforms(platforms);
      }
    } catch (error) {
      console.error("Error fetching connected platforms:", error);
    }
  };

  const fetchCampaigns = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `/api/getCampaigns?user_id=${session.user.id}`
      );
      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.campaigns.length !== 0) {
        // Fix product_image_url - handle comma-separated URLs or arrays
        const fixedCampaigns = data.campaigns.map((campaign: Campaign) => {
          console.log(
            "🔍 Original product_image_url:",
            campaign.product_image_url
          );

          let imageUrl = campaign.product_image_url;

          // If it's a string with commas, split and take first
          if (typeof imageUrl === "string" && imageUrl.includes(",")) {
            imageUrl = imageUrl.split(",")[0].trim();
          }
          // If it's an array, take the first element
          else if (Array.isArray(imageUrl)) {
            imageUrl = imageUrl[0];
          }

          // If it's still not a valid string or is empty, use a placeholder
          if (
            !imageUrl ||
            typeof imageUrl !== "string" ||
            imageUrl.trim() === ""
          ) {
            console.warn(
              "⚠️ Invalid image URL for campaign:",
              campaign.name,
              imageUrl
            );
            imageUrl = "/placeholder-product.png";
          }

          console.log("✅ Fixed product_image_url:", imageUrl);

          return {
            ...campaign,
            product_image_url: imageUrl,
          };
        });
        setCampaigns(fixedCampaigns);
      } else {
        setCampaigns([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setCampaigns([]);
      setLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchCampaigns(false);
    setTimeout(() => setIsRefreshing(false), 500);
    toast.success("Content refreshed!");
  };

  useEffect(() => {
    fetchConnectedPlatforms();
    fetchCampaigns();

    // First auto-refresh after 10 seconds
    const initialRefreshTimeout = setTimeout(() => {
      fetchCampaigns(false);
    }, 10000); // 10 seconds

    // Then auto-refresh every minute
    const autoRefreshInterval = setInterval(() => {
      fetchCampaigns(false);
    }, 60000); // 1 minute = 60000ms

    return () => {
      clearTimeout(initialRefreshTimeout);
      clearInterval(autoRefreshInterval);
    };
  }, []);

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
    // Tylko campaign_id i prefill flag - reszta załaduje się z API
    router.push(
      `/dashboard/generate-ad?campaign_id=${campaign.id}&prefill=true`
    );
  };

  const handlePostNow = async (video: any, campaign: Campaign) => {
    try {
      setLoadingCaptions(true);

      // Pobierz prawdziwe AI captions z bazy danych
      const response = await fetch(
        `/api/get-video-captions?videoId=${video.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch video captions");
      }

      const data = await response.json();

      console.log("✅ Loaded real AI captions:", data.captions);

      setSelectedVideoForCaption({
        ...video,
        productName: campaign.name,
        thumbnail: campaign.product_image_url,
        ai_captions: data.captions,
      });
      setShowCaptionModal(true);
    } catch (error) {
      console.error("Error loading captions:", error);
      toast.error("Failed to load video captions");
    } finally {
      setLoadingCaptions(false);
    }
  };

  const handlePostWithCaptions = async (postData: any) => {
    try {
      toast.loading("Posting video...");
      const response = await fetch("/api/post-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: selectedVideoForCaption.id,
          platforms: postData.platforms,
          captions: postData.captions,
          userId: userId,
          options: {
            facebookPostTypes: postData.facebookPostTypes,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to post video");
      }

      toast.dismiss();
      toast.success("Video posted successfully!");

      setShowCaptionModal(false);
      setSelectedVideoForCaption(null);
      fetchCampaigns(false);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to post video");
    }
  };

  // Calculate stats
  const totalVideos = campaigns.reduce(
    (sum, c) => sum + getVideosFromCampaign(c).length,
    0
  );

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <DashboardNavbar />
        <div className="container mx-auto px-4 py-12 mt-20 flex items-center justify-center">
          <div className="text-white text-xl">Loading your campaigns...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mt-[50px]">
      <DashboardNavbar />

      {/* Manual Refresh Button - Fixed Position */}
      <button
        onClick={handleManualRefresh}
        disabled={isRefreshing}
        className="fixed right-8 top-28 z-50 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-5 py-3 rounded-xl shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold border-2 border-cyan-400/30 hover:border-cyan-300/50 hover:scale-105 active:scale-95"
        title="Refresh content"
      >
        <RefreshCw
          className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
        />
        <span className="hidden sm:inline">Refresh</span>
      </button>

      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Campaigns</h1>
            <p className="text-gray-400">
              Manage your product campaigns and AI-generated videos
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/generate-ad")}
            className="gap-2 bg-cyan-500 hover:bg-cyan-600"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            New Campaign
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Archive className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Total Campaigns</p>
                <p className="text-3xl font-bold text-white">
                  {campaigns.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-purple-200 text-sm">Total Videos</p>
                <p className="text-3xl font-bold text-white">{totalVideos}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-orange-200 text-sm">Generating</p>
                <p className="text-3xl font-bold text-white">
                  {processingCount}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-green-200 text-sm">Ready to Post</p>
                <p className="text-3xl font-bold text-white">{readyCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Campaigns List */}
        <div className="space-y-6">
          {campaigns.map((campaign) => {
            const isExpanded = expandedCampaigns.has(campaign.id);
            const campaignVideos = getVideosFromCampaign(campaign);
            const processingProjects = getProcessingProjects(campaign);
            const processingVideos = campaignVideos.filter(
              (v) => v.status === "processing"
            );
            const readyVideos = campaignVideos.filter(
              (v) => v.status === "ready" && v.video_url
            );

            return (
              <Card
                key={campaign.id}
                className="bg-gray-800/50 border-gray-700 overflow-hidden hover:border-cyan-500/50 transition-all"
              >
                {/* Campaign Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleCampaign(campaign.id)}
                >
                  <div className="flex items-start justify-between">
                    {/* Thumbnail */}
                    <div className="flex gap-4 flex-1">
                      <img
                        src={campaign.product_image_url}
                        alt={campaign.name}
                        className="w-24 h-24 rounded-lg object-cover"
                        onError={(e) => {
                          console.error(
                            "❌ Image failed to load:",
                            campaign.product_image_url
                          );
                          // Fallback to a colored div if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback = document.createElement("div");
                          fallback.className =
                            "w-24 h-24 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold";
                          fallback.textContent = campaign.name
                            .charAt(0)
                            .toUpperCase();
                          target.parentNode?.insertBefore(fallback, target);
                        }}
                      />

                      {/* Campaign Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-2xl font-bold text-white">
                            {campaign.name}
                          </h3>
                          <Badge className="bg-purple-500 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            {campaignVideos.length} videos
                          </Badge>
                        </div>
                        <p className="text-gray-400 mb-3">
                          {campaign.description &&
                          campaign.description.trim() !== "" ? (
                            campaign.description.slice(0, 100)
                          ) : (
                            <>AI will generate description</>
                          )}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created{" "}
                            {new Date(campaign.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex gap-3 mt-4">
                    {(processingVideos.length > 0 ||
                      processingProjects.length > 0) && (
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                        <Clock className="w-3 h-3 mr-1" />
                        {processingProjects.length +
                          processingVideos.length}{" "}
                        generating
                      </Badge>
                    )}
                    {readyVideos.length > 0 && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        <Check className="w-3 h-3 mr-1" />
                        {readyVideos.length} ready to post
                      </Badge>
                    )}
                    {campaign.max_videos && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {campaignVideos.length}/{campaign.max_videos} limit
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-700">
                    {/* Generate More Button */}
                    <div className="py-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateMore(campaign);
                        }}
                        variant="outline"
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Generate More Videos
                      </Button>
                    </div>

                    {/* Processing Projects */}
                    {processingProjects.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-white font-semibold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-400" />
                                Generating Videos ({processingProjects.length})
                              </h4>
                            </div>

                            {/* Info banner */}
                            <div className="bg-orange-500/20 border border-orange-500/40 rounded-lg p-3 flex items-center gap-3">
                              <div className="bg-orange-500 p-2 rounded-lg">
                                <Clock className="w-5 h-5 text-white animate-spin" />
                              </div>
                              <div className="flex-1">
                                <p className="text-orange-200 font-semibold text-sm">
                                  AI is generating your videos
                                </p>
                                <p className="text-orange-300/80 text-xs">
                                  Average time: 2-4 minutes per video •
                                  Auto-refresh every minute or click Refresh
                                  button
                                </p>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-orange-500/10 text-orange-300 border-orange-500/30 flex items-center gap-1"
                          >
                            <Info className="w-3 h-3" />
                            ~2-4 min each
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {processingProjects.map(
                            (project: any, idx: number) => {
                              const colorScheme = getVideoColorScheme(idx);
                              const videoIcon = getVideoIcon(idx);
                              return (
                                <Card
                                  key={project.id}
                                  className="bg-gray-900/50 border-orange-500/30 overflow-hidden"
                                >
                                  <div className="relative">
                                    <div
                                      className={`aspect-[9/16] bg-gradient-to-br ${colorScheme.bg} flex items-center justify-center`}
                                    >
                                      <div className="text-6xl animate-pulse">
                                        {videoIcon}
                                      </div>
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                      <div className="text-center text-white">
                                        <Clock className="w-8 h-8 mx-auto mb-2 animate-spin" />
                                        <p className="text-sm font-medium">
                                          Generating...
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-3">
                                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 mb-2">
                                      <Clock className="w-3 h-3 mr-1" />
                                      Processing
                                    </Badge>
                                    <div className="text-xs text-gray-400">
                                      {project.quality} • {project.duration}s •{" "}
                                      {project.language?.toUpperCase() || "EN"}
                                    </div>
                                  </div>
                                </Card>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    {/* Ready Videos */}
                    {campaignVideos.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-3">
                          Generated Videos ({campaignVideos.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {campaignVideos.map((video, videoIndex) => {
                            const videoNumber =
                              campaignVideos.length - videoIndex;
                            const colorScheme = getVideoColorScheme(videoIndex);
                            const videoIcon = getVideoIcon(videoIndex);

                            return (
                              <Card
                                key={video.id}
                                className="bg-gray-900/50 border-gray-700 overflow-hidden hover:border-cyan-500/50 transition-all"
                              >
                                {/* Video Preview */}
                                <div
                                  className="relative aspect-[9/16] cursor-pointer group"
                                  onClick={() =>
                                    setPreviewVideo({
                                      ...video,
                                      productName: campaign.name,
                                      thumbnail: campaign.product_image_url,
                                      styleName:
                                        styleMapping[video.style]?.name ||
                                        video.style,
                                      styleIcon:
                                        styleMapping[video.style]?.icon || "🎬",
                                      videoNumber: videoIndex + 1,
                                      colorScheme: colorScheme,
                                    })
                                  }
                                >
                                  {video.video_url ? (
                                    <video
                                      src={video.video_url}
                                      className="w-full h-full object-cover"
                                      muted
                                    />
                                  ) : (
                                    <div
                                      className={`w-full h-full bg-gradient-to-br ${colorScheme.bg} flex items-center justify-center`}
                                    >
                                      <div className="text-6xl">
                                        {videoIcon}
                                      </div>
                                    </div>
                                  )}

                                  {/* Number Badge */}
                                  <div
                                    className={`absolute top-2 left-2 ${colorScheme.num} text-white px-3 py-1 rounded-full font-bold text-sm`}
                                  >
                                    #{videoNumber}
                                  </div>

                                  {/* Style Icon */}
                                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xl">
                                    {styleMapping[video.style]?.icon || "🎬"}
                                  </div>

                                  {/* Dark overlay gradient */}
                                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                                </div>

                                {/* Video Info */}
                                <div className="p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    {video.status === "processing" && (
                                      <Badge className="bg-orange-500/20 text-orange-300">
                                        ⏳ Generating
                                      </Badge>
                                    )}
                                    {video.status === "ready" && (
                                      <Badge className="bg-green-500/20 text-green-300">
                                        ✓ Ready
                                      </Badge>
                                    )}
                                    {video.status === "failed" && (
                                      <Badge className="bg-red-500/20 text-red-300">
                                        ✗ Failed
                                      </Badge>
                                    )}
                                    <Badge
                                      className={
                                        styleMapping[video.style]?.badgeBg
                                      }
                                    >
                                      {styleMapping[video.style]?.icon || "🎬"}{" "}
                                      {styleMapping[video.style]?.name ||
                                        video.style}
                                    </Badge>
                                  </div>

                                  <p className="text-white font-medium mb-1">
                                    Video #{videoNumber}
                                  </p>
                                  <p className="text-xs text-gray-400 mb-3">
                                    {video.quality} • {video.duration}s •{" "}
                                    {video.language?.toUpperCase() || "EN"} •{" "}
                                    {new Date(
                                      video.created_at
                                    ).toLocaleDateString()}
                                  </p>

                                  {/* Actions */}
                                  {video.status === "ready" &&
                                    video.video_url && (
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="flex-1"
                                          onClick={() =>
                                            setPreviewVideo({
                                              ...video,
                                              productName: campaign.name,
                                              thumbnail:
                                                campaign.product_image_url,
                                            })
                                          }
                                        >
                                          <Eye className="w-3 h-3 mr-1" />
                                          Preview
                                        </Button>
                                        <Button
                                          size="sm"
                                          className="flex-1"
                                          onClick={() =>
                                            handlePostNow(video, campaign)
                                          }
                                          disabled={loadingCaptions}
                                        >
                                          {loadingCaptions ? (
                                            <>
                                              <Clock className="w-3 h-3 mr-1 animate-spin" />
                                              Loading...
                                            </>
                                          ) : (
                                            <>
                                              <Send className="w-3 h-3 mr-1" />
                                              Post
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    )}
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {campaignVideos.length === 0 &&
                      processingProjects.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          No videos yet. Generate some to get started!
                        </div>
                      )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {campaigns.length === 0 && (
          <Card className="bg-gray-800/50 border-gray-700 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No campaigns yet
              </h3>
              <p className="text-gray-400 mb-6">
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="bg-gray-900 rounded-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">
                    {previewVideo.productName}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Video #{previewVideo.videoNumber}
                  </p>
                </div>
                {previewVideo.styleName && (
                  <Badge
                    className={
                      styleMapping[previewVideo.style]?.badgeBg ||
                      "bg-purple-500"
                    }
                  >
                    {previewVideo.styleIcon} {previewVideo.styleName}
                  </Badge>
                )}
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="aspect-[9/16] bg-black relative">
              {previewVideo.video_url ? (
                <video
                  src={previewVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${previewVideo.colorScheme?.bg} flex flex-col items-center justify-center`}
                >
                  <div
                    className={`${previewVideo.colorScheme?.num} text-white px-6 py-3 rounded-full font-bold text-4xl mb-8`}
                  >
                    #{previewVideo.videoNumber}
                  </div>
                  <div className="text-center text-white px-6">
                    <Clock className="w-12 h-12 mx-auto mb-4 animate-spin" />
                    <p className="text-lg font-medium">
                      Video is processing...
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPreviewVideo(null)}
              >
                Close
              </Button>
              {previewVideo.video_url && (
                <Button
                  className="flex-1"
                  onClick={async () => {
                    const campaign = campaigns.find((c) =>
                      getVideosFromCampaign(c).some(
                        (v) => v.id === previewVideo.id
                      )
                    );
                    if (campaign) {
                      setPreviewVideo(null);
                      await handlePostNow(previewVideo, campaign);
                    }
                  }}
                  disabled={loadingCaptions}
                >
                  {loadingCaptions ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post This Video
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Caption Editor Modal */}
      {showCaptionModal && selectedVideoForCaption && (
        <CaptionEditorModal
          selectedVideo={selectedVideoForCaption}
          onClose={() => {
            setShowCaptionModal(false);
            setSelectedVideoForCaption(null);
          }}
          onPost={handlePostWithCaptions}
          connectedPlatforms={connectedPlatforms}
        />
      )}
    </div>
  );
};

export default MyContent;
