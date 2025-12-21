import React, { useState } from "react";
import {
  X,
  Send,
  Sparkles,
  Edit2,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const CaptionEditorModal = ({
  selectedVideo,
  onClose,
  onPost,
  connectedPlatforms = [],
}) => {
  // Start with no platforms selected - user must choose
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [expandedPlatforms, setExpandedPlatforms] = useState(new Set());
  const [facebookPostTypes, setFacebookPostTypes] = useState(["reels"]);

  // ✅ Load real AI captions from selectedVideo.ai_captions
  const [captions, setCaptions] = useState(() => {
    // If we have real AI captions, use them
    if (selectedVideo?.ai_captions) {
      console.log(
        "✅ Loading real AI captions from database:",
        selectedVideo.ai_captions
      );
      return selectedVideo.ai_captions;
    }

    // Fallback to empty captions if none exist
    console.warn("⚠️ No AI captions found, using empty state");
    return {
      instagram: { text: "", hashtags: "" },
      facebook: { title: "", text: "" },
      youtube: { title: "", description: "" },
      tiktok: { text: "" },
      linkedin: { title: "", text: "" },
    };
  });

  const platforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      color: "bg-purple-500",
      available: true,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "👥",
      color: "bg-blue-500",
      available: true,
    },
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
      id: "linkedin",
      name: "LinkedIn",
      icon: "💼",
      color: "bg-blue-700",
      available: true,
    },
  ];

  const togglePlatform = (platformId) => {
    const normalizedId =
      platformId === "youtube_shorts" ? "youtube" : platformId;
    const isConnected = connectedPlatforms.includes(platformId);

    if (!isConnected) return;

    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );

    // Auto-expand when selected
    if (!selectedPlatforms.includes(platformId)) {
      setExpandedPlatforms((prev) => new Set([...prev, normalizedId]));
    }
  };

  const toggleExpand = (platformId) => {
    const normalizedId =
      platformId === "youtube_shorts" ? "youtube" : platformId;
    setExpandedPlatforms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(normalizedId)) {
        newSet.delete(normalizedId);
      } else {
        newSet.add(normalizedId);
      }
      return newSet;
    });
  };

  const updateCaption = (platform, field, value) => {
    setCaptions((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  const handlePost = () => {
    const captionsToPost = {};
    selectedPlatforms.forEach((platform) => {
      const normalizedId = platform === "youtube_shorts" ? "youtube" : platform;
      captionsToPost[platform] = captions[normalizedId];
    });

    onPost({
      platforms: selectedPlatforms,
      captions: captionsToPost,
      facebookPostTypes: selectedPlatforms.includes("facebook")
        ? facebookPostTypes
        : undefined,
    });
  };

  const getCharCount = (platform) => {
    const normalizedId = platform === "youtube_shorts" ? "youtube" : platform;
    const caption = captions[normalizedId];
    if (!caption) return 0;

    if (platform === "youtube" || platform === "youtube_shorts") {
      return (caption.title?.length || 0) + (caption.description?.length || 0);
    }
    return caption.text?.length || 0;
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-card border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Post to Social Media</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI-generated captions ready • Edit any platform before posting
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Platform Selection */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              Select Platforms
              <Badge variant="outline" className="ml-2">
                {selectedPlatforms.length} selected
              </Badge>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                    } ${!isConnected && "opacity-50 cursor-not-allowed"}`}
                    onClick={() => togglePlatform(platform.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={!isConnected}
                      onCheckedChange={() => togglePlatform(platform.id)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xl">{platform.icon}</span>
                      <span className="font-medium text-sm">
                        {platform.name}
                      </span>
                    </div>
                    {!isConnected && (
                      <Badge variant="outline" className="text-xs">
                        Not Connected
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Caption Editors */}
          {selectedPlatforms.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                Review & Edit Captions
                <Info className="w-4 h-4 text-muted-foreground" />
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                AI generated platform-optimized captions. Click to expand and
                edit any caption.
              </p>

              <div className="space-y-3">
                {selectedPlatforms.map((platformId) => {
                  const normalizedId =
                    platformId === "youtube_shorts" ? "youtube" : platformId;
                  const platform = platforms.find((p) => p.id === platformId);
                  const isExpanded = expandedPlatforms.has(normalizedId);
                  const caption = captions[normalizedId];

                  return (
                    <Card
                      key={platformId}
                      className="bg-muted/30 border-border hover:border-primary/50 transition-all"
                    >
                      {/* Platform Header */}
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => toggleExpand(platformId)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center text-xl`}
                            >
                              {platform.icon}
                            </div>
                            <div>
                              <h5 className="font-semibold">{platform.name}</h5>
                              <p className="text-xs text-muted-foreground">
                                {getCharCount(platformId)} characters
                                {editingPlatform === normalizedId && (
                                  <span className="ml-2 text-primary">
                                    • Editing...
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-1">
                              <Sparkles className="w-3 h-3" />
                              AI Generated
                            </Badge>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
                          {/* Title (for platforms that support it) */}
                          {(normalizedId === "facebook" ||
                            normalizedId === "linkedin" ||
                            normalizedId === "youtube") &&
                            caption?.title !== undefined && (
                              <div>
                                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                                  Title
                                  {editingPlatform === normalizedId ? (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      <Edit2 className="w-3 h-3 mr-1" />
                                      Editing
                                    </Badge>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                      onClick={() =>
                                        setEditingPlatform(normalizedId)
                                      }
                                    >
                                      <Edit2 className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                  )}
                                </label>
                                <Input
                                  value={caption.title || ""}
                                  onChange={(e) =>
                                    updateCaption(
                                      normalizedId,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="bg-background"
                                  placeholder="Post title..."
                                />
                              </div>
                            )}

                          {/* Main Text/Description */}
                          <div>
                            <label className="text-sm font-medium mb-2 flex items-center justify-between">
                              <span>
                                {normalizedId === "youtube"
                                  ? "Description"
                                  : "Caption"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {caption?.text?.length ||
                                  caption?.description?.length ||
                                  0}{" "}
                                chars
                              </span>
                            </label>
                            <Textarea
                              value={
                                caption?.text || caption?.description || ""
                              }
                              onChange={(e) =>
                                updateCaption(
                                  normalizedId,
                                  normalizedId === "youtube"
                                    ? "description"
                                    : "text",
                                  e.target.value
                                )
                              }
                              className="bg-background min-h-32 resize-none"
                              placeholder="Post caption..."
                            />
                          </div>

                          {/* Hashtags (for Instagram) */}
                          {normalizedId === "instagram" &&
                            caption?.hashtags !== undefined && (
                              <div>
                                <label className="text-sm font-medium mb-2 block">
                                  Hashtags
                                </label>
                                <Textarea
                                  value={caption.hashtags || ""}
                                  onChange={(e) =>
                                    updateCaption(
                                      normalizedId,
                                      "hashtags",
                                      e.target.value
                                    )
                                  }
                                  className="bg-background min-h-20 resize-none"
                                  placeholder="#hashtag1 #hashtag2..."
                                />
                              </div>
                            )}

                          {/* Done Editing Button */}
                          {editingPlatform === normalizedId && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full gap-2"
                              onClick={() => setEditingPlatform(null)}
                            >
                              <Check className="w-4 h-4" />
                              Done Editing
                            </Button>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Facebook Post Types */}
          {selectedPlatforms.includes("facebook") && (
            <Card className="p-4 bg-blue-500/5 border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">👥</span>
                <h4 className="font-semibold">Facebook Post Type</h4>
              </div>

              <div className="space-y-3">
                <div
                  className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    facebookPostTypes.includes("feed")
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-border hover:border-blue-500/50"
                  }`}
                  onClick={() => {
                    setFacebookPostTypes((prev) =>
                      prev.includes("feed")
                        ? prev.filter((t) => t !== "feed")
                        : [...prev, "feed"]
                    );
                  }}
                >
                  <Checkbox
                    checked={facebookPostTypes.includes("feed")}
                    onCheckedChange={(checked) => {
                      setFacebookPostTypes((prev) =>
                        checked
                          ? [...prev, "feed"]
                          : prev.filter((t) => t !== "feed")
                      );
                    }}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium">📰 Main Feed</p>
                    <p className="text-xs text-muted-foreground">
                      Standard timeline post
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    facebookPostTypes.includes("reels")
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-border hover:border-blue-500/50"
                  }`}
                  onClick={() => {
                    setFacebookPostTypes((prev) =>
                      prev.includes("reels")
                        ? prev.filter((t) => t !== "reels")
                        : [...prev, "reels"]
                    );
                  }}
                >
                  <Checkbox
                    checked={facebookPostTypes.includes("reels")}
                    onCheckedChange={(checked) => {
                      setFacebookPostTypes((prev) =>
                        checked
                          ? [...prev, "reels"]
                          : prev.filter((t) => t !== "reels")
                      );
                    }}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">🎬 Reels</p>
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-500/10 text-blue-500"
                      >
                        Recommended
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Better reach & engagement
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Summary */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium mb-1">Ready to post</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPlatforms.length} platform
                  {selectedPlatforms.length !== 1 ? "s" : ""} selected
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handlePost}
            className="flex-1 gap-2"
            disabled={selectedPlatforms.length === 0}
          >
            <Send className="w-4 h-4" />
            Post to {selectedPlatforms.length} Platform
            {selectedPlatforms.length !== 1 ? "s" : ""}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CaptionEditorModal;
