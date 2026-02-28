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

const Dashboard = () => {
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(
    null,
  );
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
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

    // Check for OAuth callback params
    const params = new URLSearchParams(window.location.search);
    if (params.get("youtube") === "connected") {
      window.history.replaceState({}, "", "/dashboard#connect");
    }
    if (params.get("tiktok") === "connected") {
      setTimeout(() => {
        alert(
          "🎉 TikTok connected successfully!\n\nYou can now post videos to TikTok.",
        );
      }, 500);
      window.history.replaceState({}, "", "/dashboard#connect");
    }
    if (params.has("error")) {
      setTimeout(() => {
        alert(`❌ Connection failed: ${params.get("error")}`);
      }, 500);
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
      const authUrl =
        `https://www.tiktok.com/v2/auth/authorize?` +
        `client_key=${clientKey}&scope=${scopes}&response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&state=${user.id}`;

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

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scopes)}&state=${user.id}&` +
        `response_type=code&access_type=offline&prompt=consent`;

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

      <div className="container mx-auto px-6 py-12 mt-20 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome to AdStream<span className="text-primary">AI</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Create and manage AI-powered video campaigns for your products
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Create Campaign Card */}
          <Card
            className="lg:col-span-2 p-8 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-primary/30 hover:border-primary/50 transition-all cursor-pointer group shadow-lg hover:shadow-xl"
            onClick={() => router.push("/dashboard/generate-ad")}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors">
                <Wand2 className="w-10 h-10 text-primary" />
              </div>
              <ExternalLink className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Create AI Videos</h2>
            <p className="text-muted-foreground text-base mb-6">
              Upload a product photo and let AI create engaging video content in
              multiple styles. Generate professional ads in minutes.
            </p>
            <Button
              size="lg"
              className="w-full gap-2 h-12 text-base relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
              <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
              Start Creating
            </Button>
          </Card>

          {/* Credits Card — REAL DATA */}
          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border hover:border-primary/50 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Available Credits
                  </p>
                  {planLoading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-primary">{credits}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                {planLoading ? (
                  <div className="bg-muted-foreground/20 h-3 rounded-full w-full animate-pulse" />
                ) : (
                  <div
                    className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${creditPercentage}%` }}
                  />
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {planLoading ? "..." : `${credits} / ${creditLimit}`}
                </span>
                {planLoading ? (
                  <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                ) : isPro ? (
                  <Badge variant="outline" className="gap-1">
                    <Crown className="w-3 h-3 text-primary" />
                    <span className="capitalize">{plan} Plan</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <Crown className="w-3 h-3" />
                    Free Plan
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                {isPro
                  ? "15 credits = 1 video (720p) • 75 credits = 1 video (1080p)"
                  : "Upgrade for more credits • 15 credits ≈ 1 video"}
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => router.push("/dashboard/billing")}
            >
              {isPro ? "Manage Billing" : "Upgrade Plan"}
            </Button>
          </Card>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card
            className="p-6 bg-card border-border hover:border-primary/50 transition-all cursor-pointer group shadow-md hover:shadow-lg"
            onClick={() => router.push("/dashboard/my-ads")}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors">
                <Video className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-2">My Campaigns</h3>
            <p className="text-muted-foreground mb-4">
              View, manage, and schedule your generated video campaigns
            </p>
            <Button variant="outline" className="w-full" size="lg">
              View Campaigns
            </Button>
          </Card>

          <Card className="relative p-6 bg-card border-border transition-all shadow-md opacity-60">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground mb-2">
                  Coming Soon
                </p>
                <p className="text-sm text-muted-foreground">
                  This feature is under development
                </p>
              </div>
            </div>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-muted rounded-xl">
                <TrendingUp className="w-8 h-8 text-foreground" />
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Analytics</h3>
            <p className="text-muted-foreground mb-4">
              Track performance and engagement across all platforms
            </p>
            <Button variant="outline" className="w-full" size="lg" disabled>
              View Analytics
            </Button>
          </Card>
        </div>

        {/* Connected Accounts Section */}
        <div id="connect">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Connected Accounts</h2>
              <p className="text-muted-foreground">
                Manage your social media connections for seamless posting
              </p>
            </div>
            <Badge variant="outline" className="gap-2 px-3 py-1">
              <Link2 className="w-4 h-4" />
              {loading
                ? "Checking..."
                : connectedPlatforms.length > 0
                  ? `${connectedPlatforms.length} Connected`
                  : "Not Connected"}
            </Badge>
          </div>

          {!loading && connectedPlatforms.length === 0 && (
            <Card className="p-10 mb-6 bg-muted/30 border-2 border-dashed border-border text-center">
              <Link2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Connect Your Accounts</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Connect your social media accounts to start posting AI-generated
                Shorts automatically. More platforms coming soon!
              </p>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platforms.map((platform) => {
              const isConnected = connectedPlatforms.includes(platform.id);
              const isConnecting = connectingPlatform === platform.id;
              const isAvailable = platform.available;

              return (
                <Card
                  key={platform.id}
                  className={`p-6 transition-all ${
                    isAvailable
                      ? "cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  } ${
                    isConnected
                      ? "border-2 border-primary bg-primary/10 hover:bg-primary/15 shadow-md"
                      : isAvailable
                        ? "border-2 border-border hover:border-primary/50 hover:shadow-md"
                        : "border-2 border-dashed border-muted-foreground/30"
                  }`}
                  onClick={() =>
                    !isConnecting && handlePlatformClick(platform.id)
                  }
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-14 h-14 ${platform.color} rounded-xl flex items-center justify-center text-2xl shadow-lg relative`}
                    >
                      {platform.icon}
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            🚧
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base">{platform.name}</h3>
                        {!isAvailable && (
                          <Badge variant="outline" className="text-xs">
                            Soon
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isConnected
                          ? "Connected"
                          : !isAvailable
                            ? "Coming soon"
                            : "Not connected"}
                      </p>
                    </div>
                  </div>

                  {isConnected ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <Check className="w-4 h-4" />
                        <span>Active & Ready</span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          disconnectPlatform(platform.id);
                        }}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : isAvailable ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Link2 className="w-4 h-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>

          {connectedPlatforms.length > 0 && (
            <div className="mt-6">
              <Card className="p-5 bg-primary/10 border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold mb-1">
                      {connectedPlatforms.length === 1
                        ? `${platforms.find((p) => p.id === connectedPlatforms[0])?.name} is connected`
                        : `${connectedPlatforms.length} platforms connected`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You can now generate campaigns and automatically post
                      videos to your connected platforms
                    </p>
                  </div>
                  <Button
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/dashboard/generate-ad");
                    }}
                  >
                    Create Campaign
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-12">
          <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2">Pro Tip</h3>
                <p className="text-muted-foreground">
                  Connect your YouTube or TikTok account to automatically post
                  AI-generated Shorts. Each video style costs 15 credits (720p),
                  and you can generate multiple styles in one campaign for
                  maximum reach! Instagram and Facebook coming soon.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
