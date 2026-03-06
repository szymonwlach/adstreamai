"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Link2,
  Check,
  Wand2,
  TrendingUp,
  Video,
  ExternalLink,
  Sparkles,
  Crown,
  ArrowRight,
  Loader2,
  X,
  ChevronRight,
  Play,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardNavbar } from "@/components/dashboardPage/DashboardNavbar";
import { supabase } from "@/integrations/supabase/client";

// ==================== TYPES ====================
interface UserPlan {
  plan: "free" | "starter" | "pro" | "enterprise";
  credits: number;
}

const PLAN_CREDIT_LIMITS: Record<string, number> = {
  free: 50,
  starter: 300,
  pro: 750,
  scale: 2000,
  enterprise: 5000,
};

// ==================== ONBOARDING STEPS ====================
const ONBOARDING_STEPS = [
  {
    id: "create",
    icon: "🎬",
    title: "Create your first ad",
    description: "Upload a product photo → AI generates the video",
    href: "/dashboard/generate-ad",
  },
  {
    id: "myads",
    icon: "📂",
    title: "View & publish in My Ads",
    description: "Download or auto-post to TikTok / YouTube",
    href: "/dashboard/my-ads",
  },
  {
    id: "connect",
    icon: "🔗",
    title: "Optional: connect a platform",
    description: "For auto-posting — skip if not needed",
    href: "#connect",
  },
];

const Dashboard = () => {
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(
    null,
  );
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const router = useRouter();

  const platforms = [
    {
      id: "youtube_shorts",
      name: "YouTube Shorts",
      icon: "▶️",
      color: "bg-red-500",
      available: true,
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "🎵",
      color: "bg-pink-500",
      available: true,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      color: "bg-purple-500",
      available: false,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "👥",
      color: "bg-blue-500",
      available: false,
    },
  ];

  // ==================== ONBOARDING LOGIC ====================
  useEffect(() => {
    const dismissed = localStorage.getItem("adstream_onboarding_dismissed");
    if (!dismissed) setShowOnboarding(true);
  }, []);

  useEffect(() => {
    const steps: string[] = [];
    if (connectedPlatforms.length > 0) steps.push("connect");
    setCompletedSteps(steps);
  }, [connectedPlatforms]);

  const dismissOnboarding = () => {
    localStorage.setItem("adstream_onboarding_dismissed", "true");
    setShowOnboarding(false);
  };

  const onboardingProgress = completedSteps.length;

  // ==================== FETCH REAL USER PLAN & CREDITS ====================
  const fetchUserPlan = async () => {
    setPlanLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const response = await fetch("/api/getPlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session.user.id }),
      });

      if (!response.ok) throw new Error("Failed to fetch plan");

      const data = await response.json();
      setUserPlan({ plan: data.plan, credits: data.credits ?? 0 });
    } catch (error) {
      console.error("❌ Failed to get user plan:", error);
      setUserPlan({ plan: "free", credits: 0 });
    } finally {
      setPlanLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth");
      } else {
        checkConnectedPlatforms();
        fetchUserPlan();
      }
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get("youtube") === "connected")
      window.history.replaceState({}, "", "/dashboard#connect");
    if (params.get("tiktok") === "connected") {
      setTimeout(
        () =>
          alert(
            "🎉 TikTok connected successfully!\n\nYou can now post videos to TikTok.",
          ),
        500,
      );
      window.history.replaceState({}, "", "/dashboard#connect");
    }
    if (params.has("error")) {
      setTimeout(
        () => alert(`❌ Connection failed: ${params.get("error")}`),
        500,
      );
      window.history.replaceState({}, "", "/dashboard#connect");
    }
  }, []);

  const checkConnectedPlatforms = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/connections?userId=${user.id}`);
      if (!response.ok) {
        setLoading(false);
        return;
      }

      const { connections } = await response.json();
      setConnectedPlatforms(connections.map((conn: any) => conn.platform));
    } catch (error) {
      console.error("Error checking connections:", error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectPlatform = async (platformId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch("/api/disconnect-platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, platform: platformId }),
      });

      if (response.ok) {
        await checkConnectedPlatforms();
        alert("✅ Platform disconnected successfully!");
      } else {
        alert("❌ Failed to disconnect platform");
      }
    } catch (error) {
      console.error("Error disconnecting platform:", error);
      alert("❌ Error disconnecting platform");
    }
  };

  const connectTikTok = async () => {
    setConnectingPlatform("tiktok");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const redirectUri = `${baseUrl}/api/auth/tiktok/callback`;
      const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
      if (!clientKey) {
        alert("TikTok Client Key is not configured.");
        setConnectingPlatform(null);
        return;
      }

      const scopes = ["user.info.basic", "video.upload", "video.publish"].join(
        ",",
      );
      const authUrl = `https://www.tiktok.com/v2/auth/authorize?client_key=${clientKey}&scope=${scopes}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${user.id}`;
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting TikTok:", error);
      setConnectingPlatform(null);
    }
  };

  const connectYouTube = async () => {
    setConnectingPlatform("youtube_shorts");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const redirectUri = `${baseUrl}/api/auth/youtube/callback`;
      const clientId = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID;
      if (!clientId) {
        alert("YouTube Client ID is not configured.");
        setConnectingPlatform(null);
        return;
      }

      const scopes = [
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/youtube.force-ssl",
      ].join(" ");
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${user.id}&response_type=code&access_type=offline&prompt=consent`;
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting YouTube:", error);
      setConnectingPlatform(null);
    }
  };

  const handlePlatformClick = async (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    if (!platform?.available) {
      alert(
        "🚧 This platform is coming soon!\n\nWe're working on integrating more platforms. Stay tuned!",
      );
      return;
    }
    if (connectedPlatforms.includes(platformId)) {
      const shouldDisconnect = confirm(
        `Do you want to disconnect ${platform.name}?`,
      );
      if (shouldDisconnect) await disconnectPlatform(platformId);
      return;
    }
    switch (platformId) {
      case "youtube_shorts":
        await connectYouTube();
        break;
      case "tiktok":
        await connectTikTok();
        break;
    }
  };

  // ==================== DERIVED VALUES ====================
  const credits = userPlan?.credits ?? 0;
  const plan = userPlan?.plan ?? "free";
  const creditLimit = PLAN_CREDIT_LIMITS[plan] ?? 50;
  const creditPercentage = Math.min((credits / creditLimit) * 100, 100);
  const isPro = plan !== "free";

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-16 sm:mt-20 max-w-7xl">
        {/* ==================== ONBOARDING BANNER ==================== */}
        {showOnboarding && (
          <div className="mb-6 sm:mb-8 relative">
            <Card className="p-4 sm:p-6 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10 border-primary/40 shadow-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold">
                      Get started in 3 steps
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs gap-1 hidden sm:flex"
                    >
                      {onboardingProgress}/3 done
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 ml-9 sm:ml-11">
                    Follow these steps to publish your first AI-generated ad
                  </p>

                  <div className="flex flex-col gap-2 sm:gap-3 ml-0 sm:ml-11">
                    {ONBOARDING_STEPS.map((step, i) => {
                      const isDone = completedSteps.includes(step.id);
                      return (
                        <a
                          key={step.id}
                          href={step.href}
                          onClick={
                            step.href.startsWith("/")
                              ? (e) => {
                                  e.preventDefault();
                                  router.push(step.href);
                                }
                              : undefined
                          }
                          className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all group ${
                            isDone
                              ? "border-primary/30 bg-primary/10 opacity-70"
                              : "border-border hover:border-primary/50 bg-background/60 hover:bg-primary/5 cursor-pointer"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isDone
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isDone ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <span className="font-bold text-xs">{i + 1}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs sm:text-sm font-semibold leading-tight ${isDone ? "line-through text-muted-foreground" : ""}`}
                            >
                              {step.icon} {step.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {step.description}
                            </p>
                          </div>
                          {!isDone && (
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 text-muted-foreground hover:text-foreground -mt-1 h-8 w-8"
                  onClick={dismissOnboarding}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome to AdStream<span className="text-primary">AI</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl">
            Create and manage AI-powered video campaigns for your products
          </p>
        </div>

        {/* ==================== TOP ROW: 2 HERO CARDS ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
          {/* 1. Create AI Videos — primary */}
          <Card
            className="p-5 sm:p-8 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-primary/30 hover:border-primary/50 transition-all cursor-pointer group shadow-lg hover:shadow-xl"
            onClick={() => router.push("/dashboard/generate-ad")}
          >
            <div className="flex items-start justify-between mb-4 sm:mb-5">
              <div className="p-3 sm:p-4 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors">
                <Wand2 className="w-7 h-7 sm:w-9 sm:h-9 text-primary" />
              </div>
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Create AI Video Ad
            </h2>
            <p className="text-muted-foreground text-sm mb-5 sm:mb-6 leading-relaxed">
              Upload a product photo and let AI generate engaging video content
              in multiple styles. Professional ads in minutes.
            </p>
            <Button
              size="lg"
              className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              Start Creating
            </Button>
          </Card>

          {/* 2. My Ads */}
          <Card
            className="p-5 sm:p-8 border-2 border-border hover:border-primary/60 transition-all cursor-pointer group shadow-lg hover:shadow-xl relative overflow-hidden"
            onClick={() => router.push("/dashboard/my-ads")}
          >
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs text-primary font-medium hidden sm:inline">
                your videos here
              </span>
            </div>

            <div className="flex items-start justify-between mb-4 sm:mb-5">
              <div className="p-3 sm:p-4 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors">
                <Video className="w-7 h-7 sm:w-9 sm:h-9 text-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">My Ads</h2>
            <p className="text-muted-foreground text-sm mb-5 sm:mb-6 leading-relaxed">
              View, manage and publish all your AI-generated video campaigns.
              Download or post directly to TikTok & YouTube.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 group-hover:border-primary/60 group-hover:text-primary transition-colors"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              View My Ads
              <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </div>

        {/* ==================== BOTTOM ROW: Credits + Connect ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
          {/* Credits */}
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-card to-card/50 border-border hover:border-primary/50 transition-all shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Available Credits
                </p>
                {planLoading ? (
                  <div className="h-6 w-12 bg-muted animate-pulse rounded mt-0.5" />
                ) : (
                  <p className="text-2xl font-bold text-primary">{credits}</p>
                )}
              </div>
              <div className="ml-auto flex-shrink-0">
                {planLoading ? (
                  <div className="h-5 w-14 bg-muted animate-pulse rounded-full" />
                ) : isPro ? (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Crown className="w-3 h-3 text-primary" />
                    <span className="capitalize">{plan}</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Free
                  </Badge>
                )}
              </div>
            </div>

            <div className="w-full bg-muted rounded-full h-2 overflow-hidden mb-2">
              {planLoading ? (
                <div className="bg-muted-foreground/20 h-2 rounded-full w-full animate-pulse" />
              ) : (
                <div
                  className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${creditPercentage}%` }}
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {planLoading ? "..." : `${credits} / ${creditLimit} credits`}
            </p>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => router.push("/dashboard/billing")}
            >
              {isPro ? "Manage Billing" : "Upgrade Plan"}
            </Button>
          </Card>

          {/* Connect accounts */}
          <Card className="p-4 sm:p-5 border-border sm:col-span-2 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                  <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  Connected Platforms
                  <Badge variant="outline" className="text-xs">
                    Optional
                  </Badge>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  For auto-posting — not required to create videos
                </p>
              </div>
              <Badge
                variant="outline"
                className="gap-1.5 text-xs flex-shrink-0 ml-2"
              >
                {loading
                  ? "..."
                  : connectedPlatforms.length > 0
                    ? `${connectedPlatforms.length} connected`
                    : "none"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2" id="connect">
              {platforms.map((platform) => {
                const isConnected = connectedPlatforms.includes(platform.id);
                const isConnecting = connectingPlatform === platform.id;
                const isAvailable = platform.available;

                return (
                  <button
                    key={platform.id}
                    disabled={!isAvailable || isConnecting}
                    onClick={() =>
                      !isConnecting && handlePlatformClick(platform.id)
                    }
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                      isConnected
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : isAvailable
                          ? "border-border hover:border-primary/40 hover:bg-accent/50 text-foreground cursor-pointer"
                          : "border-dashed border-muted-foreground/30 text-muted-foreground cursor-not-allowed opacity-60"
                    }`}
                  >
                    <span className="text-base flex-shrink-0">
                      {platform.icon}
                    </span>
                    <span className="truncate">
                      {platform.name.replace(" Shorts", "")}
                    </span>
                    {isConnected && (
                      <Check className="w-3 h-3 ml-auto flex-shrink-0" />
                    )}
                    {!isAvailable && (
                      <span className="ml-auto text-[10px] opacity-60 flex-shrink-0">
                        soon
                      </span>
                    )}
                    {isConnecting && (
                      <Loader2 className="w-3 h-3 ml-auto animate-spin flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
