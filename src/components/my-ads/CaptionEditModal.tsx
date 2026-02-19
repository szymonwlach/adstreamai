import React, { useState } from "react";
import {
  X,
  Send,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Calendar,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Info,
  Edit2,
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

const CaptionEditorModal = ({
  selectedVideo,
  onClose,
  onPost,
  connectedPlatforms = [],
}) => {
  const router = useRouter();
  const [copiedFields, setCopiedFields] = useState(new Set());
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [expandedPlatforms, setExpandedPlatforms] = useState(new Set());
  const [facebookPostTypes, setFacebookPostTypes] = useState(["reels"]);
  const [clickedPlatform, setClickedPlatform] = useState(null); // Track which platform is clicked to show captions

  // ✅ Load real AI captions from selectedVideo.ai_captions
  const [captions, setCaptions] = useState(() => {
    if (selectedVideo?.ai_captions) {
      console.log(
        "✅ Loading real AI captions from database:",
        selectedVideo.ai_captions,
      );
      return selectedVideo.ai_captions;
    }

    console.warn("⚠️ No AI captions found, using empty state");
    return {
      instagram: { text: "", hashtags: "" },
      facebook: { title: "", text: "" },
      youtube: { title: "", description: "" },
      tiktok: { text: "" },
      linkedin: { title: "", text: "" },
      x: { text: "" },
    };
  });

  const platforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: "instagram",
      color: "from-purple-600 to-pink-600",
      bgColor:
        "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
      borderColor: "border-purple-200 dark:border-purple-800",
      available: true,
      autopost: false,
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "tiktok",
      color: "from-black to-[#00f2ea]",
      bgColor:
        "bg-gradient-to-br from-gray-50 to-cyan-50 dark:from-gray-950/30 dark:to-cyan-950/30",
      borderColor: "border-cyan-200 dark:border-cyan-800",
      available: true,
      autopost: true,
    },
    {
      id: "youtube_shorts",
      name: "YouTube Shorts",
      icon: "youtube",
      color: "from-red-600 to-red-700",
      bgColor:
        "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-950/40",
      borderColor: "border-red-200 dark:border-red-800",
      available: true,
      autopost: true,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "facebook",
      color: "from-blue-600 to-blue-700",
      bgColor:
        "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/40",
      borderColor: "border-blue-200 dark:border-blue-800",
      available: true,
      autopost: false,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "linkedin",
      color: "from-blue-700 to-blue-800",
      bgColor:
        "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/40",
      borderColor: "border-blue-300 dark:border-blue-700",
      available: true,
      autopost: false,
    },
    {
      id: "x",
      name: "X (Twitter)",
      icon: "x",
      color: "from-gray-900 to-black",
      bgColor:
        "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/40",
      borderColor: "border-gray-300 dark:border-gray-700",
      available: true,
      autopost: false,
    },
  ];

  const togglePlatform = (platformId) => {
    const normalizedId =
      platformId === "youtube_shorts" ? "youtube" : platformId;

    // If clicking the same platform, close it
    if (clickedPlatform === platformId) {
      setClickedPlatform(null);
      setExpandedPlatforms(new Set());
      return;
    }

    // Open the clicked platform
    setClickedPlatform(platformId);
    setExpandedPlatforms((prev) => new Set([...prev, normalizedId]));
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

  const copyToClipboard = async (platformId, field, text) => {
    try {
      await navigator.clipboard.writeText(text);
      const fieldKey = `${platformId}-${field}`;
      setCopiedFields((prev) => new Set([...prev, fieldKey]));
      setTimeout(() => {
        setCopiedFields((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldKey);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const copyAllContent = async (platformId) => {
    const normalizedId =
      platformId === "youtube_shorts" ? "youtube" : platformId;
    const caption = captions[normalizedId];

    let allText = "";

    // Build the complete text based on platform
    if (caption?.title) {
      allText += `Title:\n${caption.title}\n\n`;
    }

    if (caption?.text) {
      allText += `Caption:\n${caption.text}\n\n`;
    }

    if (caption?.description) {
      allText += `Description:\n${caption.description}\n\n`;
    }

    if (caption?.hashtags) {
      allText += `Hashtags:\n${caption.hashtags}`;
    }

    try {
      await navigator.clipboard.writeText(allText.trim());
      const fieldKey = `${platformId}-all`;
      setCopiedFields((prev) => new Set([...prev, fieldKey]));
      setTimeout(() => {
        setCopiedFields((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldKey);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy all:", err);
    }
  };

  const isFieldCopied = (platformId, field) => {
    return copiedFields.has(`${platformId}-${field}`);
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

  // Get autopost-enabled platforms
  const autopostPlatforms = selectedPlatforms.filter((id) => {
    const platform = platforms.find((p) => p.id === id);
    return platform?.autopost && connectedPlatforms.includes(id);
  });

  // Helper function to render platform icon
  const getPlatformIcon = (iconName) => {
    const iconProps = { className: "w-5 h-5" };
    switch (iconName) {
      case "instagram":
        return <Instagram {...iconProps} />;
      case "tiktok":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        );
      case "youtube":
        return <Youtube {...iconProps} />;
      case "facebook":
        return <Facebook {...iconProps} />;
      case "linkedin":
        return <Linkedin {...iconProps} />;
      case "x":
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card
        className="max-w-4xl w-full max-h-[90vh] flex flex-col bg-card border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-card border-b border-border p-6">
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* No Connections Warning */}
            {connectedPlatforms.length === 0 && (
              <Card className="bg-orange-500/5 border-orange-500/30 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">
                      No platforms connected
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Connect your social media accounts to enable autoposting.
                      You can still copy captions manually.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push("/dashboard#connect")}
                      className="gap-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Connect Accounts
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Platform Selection */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                Choose Platform
                <Badge variant="outline" className="ml-2 text-xs">
                  Click to view captions
                </Badge>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platforms.map((platform) => {
                  const isConnected = connectedPlatforms.includes(platform.id);
                  const isSelected = selectedPlatforms.includes(platform.id);
                  const isClicked = clickedPlatform === platform.id;

                  return (
                    <div
                      key={platform.id}
                      className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${
                        isClicked
                          ? `border-primary bg-primary/10 shadow-lg ring-2 ring-primary/30`
                          : `border-border bg-card hover:border-primary/50 hover:bg-muted/30`
                      }`}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-white shadow-md`}
                        >
                          {getPlatformIcon(platform.icon)}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-sm block">
                            {platform.name}
                          </span>
                          {platform.autopost && isConnected && (
                            <Badge
                              variant="outline"
                              className="text-xs gap-1 mt-1 bg-green-500/10 text-green-600 border-green-500/30"
                            >
                              <Send className="w-2.5 h-2.5" />
                              Autopost Available
                            </Badge>
                          )}
                        </div>
                      </div>
                      {isClicked && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          Viewing
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Caption Editor - Show only for clicked platform */}
            {clickedPlatform && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  AI-Generated Caption
                  <Badge variant="outline" className="gap-1">
                    <Sparkles className="w-3 h-3" />
                    Ready to Copy
                  </Badge>
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Platform-optimized caption generated by AI. Copy or edit as
                  needed.
                </p>

                <div className="space-y-3">
                  {platforms
                    .filter((p) => p.id === clickedPlatform)
                    .map((platform) => {
                      const platformId = platform.id;
                      const normalizedId =
                        platformId === "youtube_shorts"
                          ? "youtube"
                          : platformId;
                      const isExpanded = expandedPlatforms.has(normalizedId);
                      const caption = captions[normalizedId];
                      const isAutopostPlatform = platform?.autopost;
                      const isConnected =
                        connectedPlatforms.includes(platformId);
                      const isSelected = selectedPlatforms.includes(platformId);

                      return (
                        <Card
                          key={platformId}
                          className="bg-muted/30 border-border hover:border-primary/50 transition-all"
                        >
                          {/* Platform Header */}
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
                                >
                                  {getPlatformIcon(platform.icon)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-bold text-base flex items-center gap-2">
                                    {platform.name}
                                    {isAutopostPlatform && isConnected && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs gap-1 bg-green-500/10 text-green-600 border-green-500/30"
                                      >
                                        <Send className="w-3 h-3" />
                                        Autopost
                                      </Badge>
                                    )}
                                  </h5>
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
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyAllContent(platformId);
                                  }}
                                  className={`gap-2 h-8 ${
                                    isFieldCopied(platformId, "all")
                                      ? "text-green-500 border-green-500 bg-green-500/10"
                                      : "hover:bg-primary/5"
                                  }`}
                                >
                                  {isFieldCopied(platformId, "all") ? (
                                    <>
                                      <Check className="w-4 h-4" />
                                      <span className="text-xs font-medium">
                                        Copied All
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4" />
                                      <span className="text-xs font-medium">
                                        Copy All
                                      </span>
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExpand(platformId)}
                                  className="h-8 w-8 p-0 hover:bg-primary/5"
                                >
                                  {isExpanded ? (
                                    <ChevronUp className="w-5 h-5" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Preview when collapsed */}
                          {!isExpanded && (
                            <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
                              {/* Title Preview */}
                              {caption?.title && (
                                <div className="group">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      Title
                                    </label>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(
                                          platformId,
                                          "title",
                                          caption.title || "",
                                        );
                                      }}
                                      className={`h-7 gap-1.5 transition-colors ${
                                        isFieldCopied(platformId, "title")
                                          ? "text-green-500"
                                          : "text-muted-foreground hover:text-primary"
                                      }`}
                                    >
                                      {isFieldCopied(platformId, "title") ? (
                                        <>
                                          <Check className="w-3.5 h-3.5" />
                                          <span className="text-xs font-medium">
                                            Copied
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5" />
                                          <span className="text-xs font-medium">
                                            Copy
                                          </span>
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                  <div className="text-sm text-foreground bg-background rounded-lg px-4 py-3 border border-border hover:border-primary/30 transition-colors">
                                    {caption.title}
                                  </div>
                                </div>
                              )}

                              {/* Text/Description Preview */}
                              {(caption?.text || caption?.description) && (
                                <div className="group">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                      {normalizedId === "youtube"
                                        ? "Description"
                                        : "Caption"}
                                    </label>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const text =
                                          normalizedId === "youtube"
                                            ? caption?.description || ""
                                            : caption?.text || "";
                                        copyToClipboard(
                                          platformId,
                                          "text",
                                          text,
                                        );
                                      }}
                                      className={`h-7 gap-1.5 transition-colors ${
                                        isFieldCopied(platformId, "text")
                                          ? "text-green-500"
                                          : "text-muted-foreground hover:text-primary"
                                      }`}
                                    >
                                      {isFieldCopied(platformId, "text") ? (
                                        <>
                                          <Check className="w-3.5 h-3.5" />
                                          <span className="text-xs font-medium">
                                            Copied
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5" />
                                          <span className="text-xs font-medium">
                                            Copy
                                          </span>
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                  <div className="text-sm text-foreground bg-background rounded-lg px-4 py-3 border border-border hover:border-primary/30 transition-colors whitespace-pre-wrap">
                                    {caption?.text ||
                                      caption?.description ||
                                      ""}
                                  </div>
                                </div>
                              )}

                              {/* Hashtags Preview */}
                              {normalizedId === "instagram" &&
                                caption?.hashtags && (
                                  <div className="group">
                                    <div className="flex items-center justify-between mb-1.5">
                                      <label className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                        Hashtags
                                      </label>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyToClipboard(
                                            platformId,
                                            "hashtags",
                                            caption.hashtags || "",
                                          );
                                        }}
                                        className={`h-7 gap-1.5 transition-colors ${
                                          isFieldCopied(platformId, "hashtags")
                                            ? "text-green-500"
                                            : "text-muted-foreground hover:text-primary"
                                        }`}
                                      >
                                        {isFieldCopied(
                                          platformId,
                                          "hashtags",
                                        ) ? (
                                          <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">
                                              Copied
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">
                                              Copy
                                            </span>
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                    <div className="text-sm text-foreground bg-background rounded-lg px-4 py-3 border border-border hover:border-primary/30 transition-colors">
                                      {caption.hashtags}
                                    </div>
                                  </div>
                                )}

                              {/* Click to expand hint */}
                              <div className="pt-2 border-t border-border/50">
                                <button
                                  onClick={() => toggleExpand(platformId)}
                                  className="w-full text-xs text-muted-foreground hover:text-primary text-center py-2 flex items-center justify-center gap-2 transition-colors rounded hover:bg-muted/50"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  Click to expand and edit
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
                              {/* Title (for platforms that support it) */}
                              {(normalizedId === "facebook" ||
                                normalizedId === "linkedin" ||
                                normalizedId === "youtube") &&
                                caption?.title !== undefined && (
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <label className="text-sm font-medium">
                                        Title
                                      </label>
                                      <div className="flex items-center gap-2">
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
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingPlatform(normalizedId);
                                            }}
                                          >
                                            <Edit2 className="w-3 h-3 mr-1" />
                                            Edit
                                          </Button>
                                        )}
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            copyToClipboard(
                                              platformId,
                                              "title",
                                              caption.title || "",
                                            )
                                          }
                                          className={`h-8 gap-1.5 transition-colors ${
                                            isFieldCopied(platformId, "title")
                                              ? "text-green-500"
                                              : "text-muted-foreground hover:text-primary"
                                          }`}
                                        >
                                          {isFieldCopied(
                                            platformId,
                                            "title",
                                          ) ? (
                                            <>
                                              <Check className="w-3.5 h-3.5" />
                                              <span className="text-xs">
                                                Copied
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="w-3.5 h-3.5" />
                                              <span className="text-xs">
                                                Copy
                                              </span>
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                    <Input
                                      value={caption.title || ""}
                                      onChange={(e) =>
                                        updateCaption(
                                          normalizedId,
                                          "title",
                                          e.target.value,
                                        )
                                      }
                                      className="bg-background"
                                      placeholder="Post title..."
                                    />
                                  </div>
                                )}

                              {/* Main Text/Description */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-sm font-medium">
                                    {normalizedId === "youtube"
                                      ? "Description"
                                      : "Caption"}
                                    <span className="text-xs text-muted-foreground ml-2">
                                      (
                                      {caption?.text?.length ||
                                        caption?.description?.length ||
                                        0}{" "}
                                      chars)
                                    </span>
                                  </label>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      const text =
                                        normalizedId === "youtube"
                                          ? caption?.description || ""
                                          : caption?.text || "";
                                      copyToClipboard(platformId, "text", text);
                                    }}
                                    className={`h-8 gap-1.5 transition-colors ${
                                      isFieldCopied(platformId, "text")
                                        ? "text-green-500"
                                        : "text-muted-foreground hover:text-primary"
                                    }`}
                                  >
                                    {isFieldCopied(platformId, "text") ? (
                                      <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span className="text-xs">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span className="text-xs">Copy</span>
                                      </>
                                    )}
                                  </Button>
                                </div>
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
                                      e.target.value,
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
                                    <div className="flex items-center justify-between mb-2">
                                      <label className="text-sm font-medium">
                                        Hashtags
                                      </label>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          copyToClipboard(
                                            platformId,
                                            "hashtags",
                                            caption.hashtags || "",
                                          )
                                        }
                                        className={`h-8 gap-1.5 transition-colors ${
                                          isFieldCopied(platformId, "hashtags")
                                            ? "text-green-500"
                                            : "text-muted-foreground hover:text-primary"
                                        }`}
                                      >
                                        {isFieldCopied(
                                          platformId,
                                          "hashtags",
                                        ) ? (
                                          <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span className="text-xs">
                                              Copied
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span className="text-xs">
                                              Copy
                                            </span>
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                    <Textarea
                                      value={caption.hashtags || ""}
                                      onChange={(e) =>
                                        updateCaption(
                                          normalizedId,
                                          "hashtags",
                                          e.target.value,
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

                              {/* Autopost Notice for TikTok/YouTube */}
                              {isAutopostPlatform && isConnected && (
                                <div className="pt-3 border-t border-border">
                                  <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                                    <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-foreground mb-2">
                                        Autopost available for {platform.name}
                                      </div>
                                      <p className="text-xs text-muted-foreground mb-3">
                                        This video can be automatically posted
                                        to {platform.name}. Select it below to
                                        enable autoposting.
                                      </p>
                                      <Button
                                        size="sm"
                                        variant={
                                          isSelected ? "default" : "outline"
                                        }
                                        className="gap-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedPlatforms((prev) =>
                                            prev.includes(platformId)
                                              ? prev.filter(
                                                  (id) => id !== platformId,
                                                )
                                              : [...prev, platformId],
                                          );
                                        }}
                                      >
                                        {isSelected ? (
                                          <>
                                            <Check className="w-4 h-4" />
                                            Selected for Autopost
                                          </>
                                        ) : (
                                          <>
                                            <Send className="w-4 h-4" />
                                            Select for Autopost
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
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
                          : [...prev, "feed"],
                      );
                    }}
                  >
                    <Checkbox
                      checked={facebookPostTypes.includes("feed")}
                      onCheckedChange={(checked) => {
                        setFacebookPostTypes((prev) =>
                          checked
                            ? [...prev, "feed"]
                            : prev.filter((t) => t !== "feed"),
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
                          : [...prev, "reels"],
                      );
                    }}
                  >
                    <Checkbox
                      checked={facebookPostTypes.includes("reels")}
                      onCheckedChange={(checked) => {
                        setFacebookPostTypes((prev) =>
                          checked
                            ? [...prev, "reels"]
                            : prev.filter((t) => t !== "reels"),
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
            {selectedPlatforms.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium mb-1">Ready to post</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPlatforms.length} platform
                      {selectedPlatforms.length !== 1 ? "s" : ""} selected
                      {autopostPlatforms.length > 0 &&
                        ` • ${autopostPlatforms.length} with autopost`}
                    </p>
                  </div>
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 bg-card border-t border-border p-6">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>

            {/* Show Post button only if platforms are selected (checked) */}
            {selectedPlatforms.length > 0 && (
              <>
                <Button onClick={handlePost} className="flex-1 gap-2">
                  <Send className="w-4 h-4" />
                  Post to {selectedPlatforms.length} Platform
                  {selectedPlatforms.length !== 1 ? "s" : ""}
                </Button>

                {/* Show Schedule only if TikTok or YouTube is selected */}
                {(selectedPlatforms.includes("tiktok") ||
                  selectedPlatforms.includes("youtube_shorts")) && (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      alert(
                        "Scheduling feature coming soon! This will open a calendar drag-and-drop interface.",
                      );
                    }}
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Post
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CaptionEditorModal;
