"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Link2,
  Check,
  Wand2,
  TrendingUp,
  Video,
  Calendar,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardNavbar } from "@/components/dashboardPage/DashboardNavbar";

const Dashboard = () => {
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const router = useRouter();

  const platforms = [
    { id: "tiktok", name: "TikTok", icon: "🎵", color: "bg-pink-500" },
    { id: "instagram", name: "Instagram", icon: "📸", color: "bg-purple-500" },
    { id: "facebook", name: "Facebook", icon: "👥", color: "bg-blue-500" },
    { id: "youtube", name: "YouTube Shorts", icon: "▶️", color: "bg-red-500" },
    { id: "linkedin", name: "LinkedIn", icon: "💼", color: "bg-blue-700" },
  ];

  const toggleConnection = (platformId: string) => {
    setConnectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const stats = {
    totalPosts: 24,
    activeVideos: 12,
    scheduledPosts: 8,
    totalViews: "45.2K",
  };

  return (
    <div className="min-h-screen bg-background" >
      <DashboardNavbar />

      <div className="container mx-auto px-6 py-12 mt-16 ">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to <span className="text-gradient">AdStream</span>AI
          </h1>
          <p className="text-muted-foreground text-lg">
            Create and manage AI-powered video ads for your products
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card
            className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary transition-all cursor-pointer group"
            onClick={() => router.push("/dashboard/generate-ad")}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                <Wand2 className="w-8 h-8 text-primary" />
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Generate New Ad</h3>
            <p className="text-muted-foreground mb-4">
              Upload a product photo and let AI create engaging video content in
              multiple styles
            </p>
            <Button className="w-full" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Start Creating
            </Button>
          </Card>

          <Card
            className="p-8 bg-card border-border hover:border-primary transition-all cursor-pointer group"
            onClick={() => router.push("/dashboard/my-ads")}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                <Video className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-2">My Ads</h3>
            <p className="text-muted-foreground mb-4">
              View, edit, and schedule your generated video ads across platforms
            </p>
            <Button variant="outline" className="w-full" size="lg">
              View All Ads
            </Button>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Total Posts
                </span>
                <Video className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-bold">{stats.totalPosts}</p>
              <p className="text-xs text-primary mt-1">+4 this week</p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Active Videos
                </span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-bold">{stats.activeVideos}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Currently live
              </p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Scheduled</span>
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-bold">{stats.scheduledPosts}</p>
              <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Total Views
                </span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-3xl font-bold">{stats.totalViews}</p>
              <p className="text-xs text-primary mt-1">+12% vs last week</p>
            </Card>
          </div>
        </div>

        {/* Connected Accounts Section */}
        <div id="connect">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Connected Accounts</h2>
              <p className="text-muted-foreground">
                Manage your social media connections
              </p>
            </div>
            <Badge variant="outline" className="gap-2">
              <Link2 className="w-4 h-4" />
              {connectedPlatforms.length} / {platforms.length} connected
            </Badge>
          </div>

          {connectedPlatforms.length === 0 && (
            <Card className="p-8 mb-6 bg-muted/50 border-dashed border-border text-center">
              <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                No accounts connected yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Connect your social media accounts to start posting AI-generated
                content
              </p>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform) => {
              const isConnected = connectedPlatforms.includes(platform.id);
              return (
                <Card
                  key={platform.id}
                  className={`p-6 transition-all cursor-pointer ${
                    isConnected
                      ? "border-primary bg-primary/5 hover:bg-primary/10"
                      : "border-border hover:border-primary"
                  }`}
                  onClick={() => toggleConnection(platform.id)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-14 h-14 ${platform.color} rounded-lg flex items-center justify-center text-3xl`}
                    >
                      {platform.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {isConnected ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>

                  {isConnected ? (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Check className="w-4 h-4" />
                      <span className="font-medium">Active</span>
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full" size="sm">
                      <Link2 className="w-4 h-4 mr-2" />
                      Connect Account
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>

          {connectedPlatforms.length > 0 && (
            <div className="mt-6">
              <Card className="p-4 bg-primary/10 border-primary/20">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Great! You've connected {connectedPlatforms.length}{" "}
                      platform{connectedPlatforms.length > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You can now generate ads and post them to your connected
                      accounts
                    </p>
                  </div>
                  <Button
                    className="ml-auto"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/dashboard/generate-ad");
                    }}
                  >
                    Create First Ad
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-12">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wand2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                <p className="text-muted-foreground text-sm">
                  Connect all your social media accounts now to seamlessly post
                  your AI-generated content across multiple platforms. Each
                  video style costs 1 credit, and you can generate multiple
                  styles at once!
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
