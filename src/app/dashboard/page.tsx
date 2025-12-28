"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Link2,
  Check,
  Wand2,
  TrendingUp,
  Video,
  Calendar,
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

const Dashboard = () => {
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(
    null
  );
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
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      color: "bg-purple-500",
      available: false,
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "🎵",
      color: "bg-pink-500",
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

  useEffect(() => {
    console.log("📍 Dashboard page loaded");

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        console.log("❌ No user found, redirecting to auth");
        router.push("/auth");
      } else {
        console.log("✅ User logged in:", user.id);
        checkConnectedPlatforms();
      }
    });

    // ✅ DODANE: Check for connection success messages
    const params = new URLSearchParams(window.location.search);
    if (params.has("youtube")) {
      const status = params.get("youtube");
      if (status === "connected") {
        // setTimeout(() => {
        //   alert(
        //     "🎉 YouTube connected successfully!\n\nYou can now upload videos to YouTube Shorts."
        //   );
        // }, 500);
        // Clean URL
        window.history.replaceState({}, "", "/dashboard#connect");
      }
    }
    if (params.has("tiktok")) {
      const status = params.get("tiktok");
      if (status === "connected") {
        // setTimeout(() => {
        //   alert(
        //     "🎉 TikTok connected successfully!\n\nYou can now post videos to TikTok."
        //   );
        // }, 500);
        window.history.replaceState({}, "", "/dashboard#connect");
      }
    }
    if (params.has("error")) {
      const error = params.get("error");
      setTimeout(() => {
        alert(`❌ Connection failed: ${error}`);
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
        console.error("Failed to fetch connections");
        setLoading(false);
        return;
      }

      const { connections } = await response.json();

      const connectedPlatformIds = connections.map(
        (conn: any) => conn.platform
      );
      setConnectedPlatforms(connectedPlatformIds);
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

  // ✅ NOWA FUNKCJA: Connect TikTok
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

      console.log("🔍 TikTok Redirect URI:", redirectUri);

      if (
        !redirectUri.startsWith("http://") &&
        !redirectUri.startsWith("https://")
      ) {
        console.error("❌ Invalid redirect URI:", redirectUri);
        alert(
          "Configuration error: Invalid redirect URI. Check NEXT_PUBLIC_APP_URL in .env"
        );
        setConnectingPlatform(null);
        return;
      }

      const state = user.id;

      // TikTok OAuth Scopes
      const scopes = ["user.info.basic", "video.upload", "video.publish"].join(
        ","
      );

      console.log("🔑 Using TikTok scopes:", scopes);

      const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
      if (!clientKey) {
        console.error("❌ NEXT_PUBLIC_TIKTOK_CLIENT_KEY not configured!");
        alert("TikTok Client Key is not configured. Check your .env file.");
        setConnectingPlatform(null);
        return;
      }

      const authUrl =
        `https://www.tiktok.com/v2/auth/authorize?` +
        `client_key=${clientKey}&` +
        `scope=${scopes}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=${state}`;

      console.log("🚀 Redirecting to TikTok OAuth:", authUrl);
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting TikTok:", error);
      setConnectingPlatform(null);
    }
  };
  const connectInstagram = async () => {
    setConnectingPlatform("instagram");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const redirectUri = `${baseUrl}/auth/meta/callback`;

      console.log("🔍 Meta Redirect URI:", redirectUri);

      if (
        !redirectUri.startsWith("http://") &&
        !redirectUri.startsWith("https://")
      ) {
        console.error("❌ Invalid redirect URI:", redirectUri);
        alert(
          "Configuration error: Invalid redirect URI. Check NEXT_PUBLIC_APP_URL in .env"
        );
        setConnectingPlatform(null);
        return;
      }

      const state = user.id;

      const scopes = [
        "pages_show_list",
        "instagram_basic",
        "instagram_content_publish",
        "pages_read_engagement",
        "business_management",
      ].join(",");

      console.log("🔑 Using scopes for Instagram posting:", scopes);

      const clientId = process.env.NEXT_PUBLIC_META_APP_ID;
      if (!clientId) {
        console.error("❌ NEXT_PUBLIC_META_APP_ID not configured!");
        alert("Meta App ID is not configured. Check your .env file.");
        setConnectingPlatform(null);
        return;
      }

      const authUrl =
        `https://www.facebook.com/v21.0/dialog/oauth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${scopes}&` +
        `state=${state}&` +
        `response_type=code`;

      console.log("🚀 Redirecting to Meta OAuth:", authUrl);
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting Instagram:", error);
      setConnectingPlatform(null);
    }
  };

  const connectFacebook = async () => {
    setConnectingPlatform("facebook");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const hasInstagram = connectedPlatforms.includes("instagram");

      if (!hasInstagram) {
        alert(
          "⚠️ Please connect Instagram first!\n\nFacebook posting requires Instagram connection with a Facebook Page."
        );
        setConnectingPlatform(null);
        return;
      }

      console.log("🔗 Connecting Facebook using Instagram credentials...");

      const response = await fetch("/api/connect-facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to connect Facebook");
        setConnectingPlatform(null);
        return;
      }

      console.log("✅ Facebook connected successfully!");

      await checkConnectedPlatforms();
      setConnectingPlatform(null);

      alert(
        "🎉 Facebook connected successfully!\n\nYou can now post videos to your Facebook Page."
      );
    } catch (error) {
      console.error("❌ Error connecting Facebook:", error);
      alert("Failed to connect Facebook. Please try again.");
      setConnectingPlatform(null);
    }
  };

  // ✅ NOWA FUNKCJA: Connect YouTube
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

      console.log("🔍 YouTube Redirect URI:", redirectUri);

      if (
        !redirectUri.startsWith("http://") &&
        !redirectUri.startsWith("https://")
      ) {
        console.error("❌ Invalid redirect URI:", redirectUri);
        alert(
          "Configuration error: Invalid redirect URI. Check NEXT_PUBLIC_APP_URL in .env"
        );
        setConnectingPlatform(null);
        return;
      }

      const state = user.id;

      // YouTube OAuth Scopes
      const scopes = [
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/youtube.force-ssl",
      ].join(" ");

      console.log("🔑 Using YouTube scopes:", scopes);

      const clientId = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID;
      if (!clientId) {
        console.error("❌ NEXT_PUBLIC_YOUTUBE_CLIENT_ID not configured!");
        alert("YouTube Client ID is not configured. Check your .env file.");
        setConnectingPlatform(null);
        return;
      }

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `state=${state}&` +
        `response_type=code&` +
        `access_type=offline&` + // Get refresh token
        `prompt=consent`; // Force consent screen to get refresh token

      console.log("🚀 Redirecting to YouTube OAuth:", authUrl);
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting YouTube:", error);
      setConnectingPlatform(null);
    }
  };

  const handlePlatformClick = async (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);

    // If platform is not available yet
    if (!platform?.available) {
      alert(
        "🚧 This platform is coming soon!\n\nWe're working on integrating more platforms. Stay tuned!"
      );
      return;
    }

    // If already connected, show disconnect option
    if (connectedPlatforms.includes(platformId)) {
      const shouldDisconnect = confirm(
        `Do you want to disconnect ${platform.name}?`
      );
      if (shouldDisconnect) {
        await disconnectPlatform(platformId);
      }
      return;
    }

    // Only YouTube is available to connect
    switch (platformId) {
      case "youtube_shorts":
        await connectYouTube();
        break;
    }
  };

  const stats = {
    totalPosts: 24,
    activeVideos: 12,
    scheduledPosts: 8,
    totalViews: "45.2K",
    tokensAvailable: 150,
    tokensMonthlyLimit: 200,
    subscriptionType: "pro",
    renewalDate: "Jan 15, 2025",
  };

  const tokenPercentage =
    (stats.tokensAvailable / stats.tokensMonthlyLimit) * 100;

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

          {/* Credits Card */}
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
                  <p className="text-3xl font-bold text-primary">
                    {stats.tokensAvailable}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${tokenPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {stats.tokensAvailable} / {stats.tokensMonthlyLimit}
                </span>
                {stats.subscriptionType === "free" ? (
                  <Badge variant="outline" className="gap-1">
                    <Crown className="w-3 h-3" />
                    Free Plan
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <Crown className="w-3 h-3 text-primary" />
                    Pro Plan
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                {stats.subscriptionType === "free"
                  ? "Upgrade for more credits • 15 credits ≈ 1 video"
                  : `Renews ${stats.renewalDate} • 15 credits = 1 video`}
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => router.push("/dashboard/billing")}
            >
              {stats.subscriptionType === "free"
                ? "Upgrade Plan"
                : "Manage Billing"}
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

          <Card
            className="p-6 bg-card border-border hover:border-primary/50 transition-all cursor-pointer group shadow-md hover:shadow-lg"
            onClick={() => router.push("/dashboard/analytics")}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors">
                <TrendingUp className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Analytics</h3>
            <p className="text-muted-foreground mb-4">
              Track performance and engagement across all platforms
            </p>
            <Button variant="outline" className="w-full" size="lg">
              View Analytics
            </Button>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Performance Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Posts
                </span>
                <Video className="w-5 h-5 text-primary" />
              </div>
              <p className="text-4xl font-bold">{stats.totalPosts}</p>
              <p className="text-sm text-green-500 mt-2">+4 this week</p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Active Videos
                </span>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-4xl font-bold">{stats.activeVideos}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Currently live
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Scheduled
                </span>
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-4xl font-bold">{stats.scheduledPosts}</p>
              <p className="text-sm text-muted-foreground mt-2">Coming soon</p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Views
                </span>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-4xl font-bold">{stats.totalViews}</p>
              <p className="text-sm text-green-500 mt-2">+12% vs last week</p>
            </Card>
          </div>
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
              {connectedPlatforms.length > 0
                ? "YouTube Connected"
                : "Not Connected"}
            </Badge>
          </div>

          {!loading && connectedPlatforms.length === 0 && (
            <Card className="p-10 mb-6 bg-muted/30 border-2 border-dashed border-border text-center">
              <Link2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">
                Connect Your YouTube Account
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Connect your YouTube account to start posting AI-generated
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
                        {platform.id === "youtube_shorts" && isAvailable && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
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
                      Great! Your YouTube is connected
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You can now generate campaigns and automatically post
                      Shorts to your YouTube channel
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
                  Connect your YouTube account to automatically post
                  AI-generated Shorts. Each video style costs 15 credits, and
                  you can generate multiple styles in one campaign for maximum
                  reach! More platforms (Instagram, TikTok, Facebook) coming
                  soon.
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
