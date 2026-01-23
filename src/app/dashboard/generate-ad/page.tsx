"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Upload,
  Sparkles,
  Wand2,
  Globe,
  Crown,
  Info,
  X,
  Type,
  Volume2,
  VolumeX,
  Heart,
  TrendingUp,
  ShoppingBag,
  Film,
  Palette,
  ChevronDown,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardNavbar } from "@/components/dashboardPage/DashboardNavbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const CollapsibleSection = ({
  id,
  title,
  icon,
  children,
  badge,
  expandedSection,
  setExpandedSection,
}: {
  id: string;
  title: string;
  icon: any;
  children: React.ReactNode;
  badge?: string;
  expandedSection: string | null;
  setExpandedSection: (id: string | null) => void;
}) => {
  const isExpanded = expandedSection === id;

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setExpandedSection(isExpanded ? null : id)}
    >
      <div className="w-full p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">{icon}</div>
          <div className="text-left">
            <h3 className="font-semibold">{title}</h3>
            {badge && (
              <p className="text-xs text-muted-foreground mt-0.5">{badge}</p>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {isExpanded && (
        <div className="p-5 pt-0 border-t" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </Card>
  );
};

const GenerateAdContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const campaignId = searchParams.get("campaign_id");
  const shouldPrefill = searchParams.get("prefill") === "true";

  const [campaignName, setCampaignName] = useState("");
  const [productImages, setProductImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [userCredits, setUserCredits] = useState(10);
  const [userPlan, setUserPlan] = useState<any>(null);
  const [isPrefillingFromCampaign, setIsPrefillingFromCampaign] =
    useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);

  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [subtitleStyle, setSubtitleStyle] = useState("modern");
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState(false);
  const [colorScheme, setColorScheme] = useState("auto");

  // Collapsed sections
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "styles"
  );

  const prevCampaignIdRef = useRef<string | null>(null);

  const MAX_IMAGES = 5;

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "pl", name: "Polski", flag: "🇵🇱" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  ];

  const videoStyles = [
    {
      id: "ugc",
      name: "UGC Style",
      desc: "Authentic, relatable creator feel",
      icon: "👤",
      premium: false,
      category: "organic",
      previewVideo: "/previews_video/ugc.mp4",
    },
    {
      id: "trend",
      name: "Trend",
      desc: "Quick cuts, high energy & beats",
      icon: "⚡",
      premium: false,
      category: "trending",
      previewVideo: "/previews_video/trend.mp4",
    },
    {
      id: "cinematic_luxury",
      name: "Cinematic Luxury",
      desc: "Slow motion, premium lighting",
      icon: "💎",
      premium: false,
      category: "premium",
      previewVideo: "/previews_video/luxury_watch.mp4",
    },
    {
      id: "product_showcase",
      name: "Studio Focus",
      desc: "Clean, professional product shots",
      icon: "📦",
      premium: false,
      category: "ecommerce",
      previewVideo: "/previews_video/product_showcase.mp4",
    },
    {
      id: "stop_motion",
      name: "Stop-Motion",
      desc: "Playful, frame-by-frame animation",
      icon: "🧱",
      premium: false,
      category: "creative",
      previewVideo: "/previews_video/stop_motion.mp4",
    },
    {
      id: "before_after",
      name: "Before/After",
      desc: "Proven result transformation",
      icon: "🔄",
      premium: false,
      category: "ecommerce",
      previewVideo: "/previews_video/before_after.mp4",
    },
    {
      id: "educational",
      name: "Educational",
      desc: "Clear steps and key features",
      icon: "🎓",
      premium: false,
      category: "organic",
      previewVideo: "/previews_video/educational.mp4",
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      desc: "Product in real-world scenarios",
      icon: "✨",
      premium: false,
      category: "ecommerce",
      previewVideo: "/previews_video/lifestyle.mp4",
    },
    {
      id: "unboxing",
      name: "Unboxing",
      desc: "First impression & reveal experience",
      icon: "🎁",
      premium: false,
      category: "trending",
      previewVideo: "/previews_video/unboxing.mp4",
    },
    {
      id: "asmr",
      name: "ASMR/Satisfying",
      desc: "Focus on textures and close-ups",
      icon: "🎧",
      premium: true,
      category: "trending",
      previewVideo: "/previews_video/asmr.mp4",
    },
    {
      id: "cyber_glitch",
      name: "Cyber Tech",
      desc: "Futuristic neons and glitch effects",
      icon: "🤖",
      premium: true,
      category: "creative",
      previewVideo: "/previews_video/cyber_tech.mp4",
    },
    {
      id: "surreal_abstract",
      name: "Dreamy Surreal",
      desc: "Physics-defying magic visuals",
      icon: "🌌",
      premium: true,
      category: "premium",
      previewVideo: "/previews_video/surreal.mp4",
    },
  ];

  const subtitleStyles = [
    { id: "modern", name: "Modern Bold" },
    { id: "minimal", name: "Minimal" },
    { id: "karaoke", name: "Karaoke" },
    { id: "caption", name: "Caption Box" },
  ];

  const colorSchemes = [
    { id: "auto", name: "Auto (AI)" },
    { id: "vibrant", name: "Vibrant" },
    { id: "pastel", name: "Pastel" },
    { id: "dark", name: "Dark Mode" },
    { id: "neon", name: "Neon" },
  ];

  const getPlan = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const response = await fetch("/api/getPlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session?.user.id }),
      });
      const user_plan = await response.json();
      setUserPlan(user_plan);
    } catch (error) {
      console.error("Failed to get user plan", error);
    }
  };

  useEffect(() => {
    const prefillFromCampaign = async () => {
      if (!campaignId || !shouldPrefill) return;
      if (prevCampaignIdRef.current === campaignId) return;

      try {
        setIsPrefillingFromCampaign(true);
        prevCampaignIdRef.current = campaignId;

        const {
          data: { session },
        } = await supabase.auth.getSession();
        const response = await fetch(
          `/api/getCampaigns?user_id=${session?.user.id}`
        );
        const data = await response.json();
        const campaign = data.campaigns.find((c: any) => c.id === campaignId);

        if (campaign) {
          setCampaignName(campaign.name);
          let images: string[] = [];
          if (campaign.product_image_url) {
            if (Array.isArray(campaign.product_image_url)) {
              images = campaign.product_image_url;
            } else if (typeof campaign.product_image_url === "string") {
              images = campaign.product_image_url.includes(",")
                ? campaign.product_image_url
                    .split(",")
                    .map((url: string) => url.trim())
                : [campaign.product_image_url];
            }
          }
          setProductImages(images);
          setDescription(campaign.description || "");
          toast.success("Campaign loaded!");
        }
      } catch (error) {
        console.error("Failed to prefill from campaign:", error);
        toast.error("Failed to load campaign data");
      } finally {
        setIsPrefillingFromCampaign(false);
      }
    };

    prefillFromCampaign();
  }, [campaignId, shouldPrefill]);

  useEffect(() => {
    getPlan();
  }, []);

  const isFreeUser = userPlan?.plan === "free" || !userPlan || !userPlan?.plan;
  const canUse1080p = !isFreeUser;
  const canUse15sec = !isFreeUser && selectedQuality === "1080p";

  const toggleStyle = (styleId: string, isPremium: boolean) => {
    if (isPremium && isFreeUser) {
      toast.warning("Premium Feature", {
        description: "Upgrade to unlock all video styles!",
        icon: <Crown className="w-5 h-5 text-amber-500" />,
        action: {
          label: "Upgrade",
          onClick: () => router.push("/dashboard/pricing"),
        },
      });
      return;
    }

    setSelectedStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((id) => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (productImages.length + files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);

        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;

        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("product-images").getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setProductImages((prev) => {
        const previews = prev.slice(-files.length);
        const withoutPreviews = prev.slice(0, -files.length);
        return [...withoutPreviews, ...uploadedUrls];
      });

      toast.success(
        `${files.length} image${files.length > 1 ? "s" : ""} uploaded`
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const creditsNeeded = selectedStyles.length;
  const canGenerate =
    userCredits >= creditsNeeded &&
    creditsNeeded > 0 &&
    productImages.length > 0;

  const handleGenerate = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      toast.error("Please log in to generate ads");
      return;
    }

    if (productImages.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    if (selectedStyles.length === 0) {
      toast.error("Please select at least one video style");
      return;
    }

    try {
      const projectData = {
        user_id: session.user.id,
        product_url: productImages,
        selected_style: selectedStyles, // Backend chce selected_style (bez s)
        name: campaignName.trim() || null,
        description: description.trim() || null,
        language: selectedLanguage,
        quality: selectedQuality,
        duration: selectedDuration,
        campaign_id: campaignId && campaignId.trim() !== "" ? campaignId : null,
        subtitles_enabled: subtitlesEnabled,
        subtitle_style: subtitleStyle,
        music_enabled: musicEnabled,
        voiceover_enabled: voiceoverEnabled,
        color_scheme: colorScheme,
      };

      console.log("=== DEBUG ===");
      console.log("user_id:", projectData.user_id);
      console.log("product_url:", projectData.product_url);
      console.log("selected_style:", projectData.selected_style);
      console.log("Cały obiekt:", JSON.stringify(projectData, null, 2));

      const saveResponse = await fetch("/api/saveAd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData), // Wyślij projectData, NIE cleanedData!
      });
      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(
          errorData.details || errorData.error || "Failed to save project"
        );
      }

      const { projectId, campaignId: newCampaignId } =
        await saveResponse.json();

      const n8nResponse = await fetch("/api/sendToN8n", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          campaign_id: newCampaignId,
          user_id: session.user.id,
          plan: userPlan,
          product_name: campaignName.trim() || "Untitled Campaign",
          description: description.trim() || undefined,
          product_images: productImages,
          selected_styles: selectedStyles,
          language:
            languages.find((l) => l.code === selectedLanguage)?.name ||
            "English",
          quality: selectedQuality,
          duration: selectedDuration,
          subtitles_enabled: subtitlesEnabled,
          subtitle_style: subtitlesEnabled ? subtitleStyle : null,
          color_scheme: subtitlesEnabled ? colorScheme : null,
          music_enabled: musicEnabled,
        }),
      });

      const n8nData = await n8nResponse.json();

      if (!n8nResponse.ok) {
        await fetch("/api/deleteAd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_id: projectId,
            campaign_id: newCampaignId,
          }),
        }).catch((err) => console.error("Rollback failed:", err));

        throw new Error(n8nData.error || "Failed to send to n8n");
      }

      toast.success(
        campaignId ? "More ads are being generated!" : "Campaign created!"
      );
      router.push("/dashboard/my-ads?refresh=true");
    } catch (error) {
      console.error("❌ Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to generate ads", { description: errorMessage });
    }
  };

  const StyleCard = ({ style }: { style: any }) => {
    const isSelected = selectedStyles.includes(style.id);
    const isLocked = style.premium && isFreeUser;
    const isHovered = hoveredStyle === style.id;

    return (
      <Card
        className={`relative overflow-hidden transition-all duration-300 ${
          isLocked
            ? "opacity-60 cursor-not-allowed"
            : `cursor-pointer hover:shadow-lg ${
                isSelected
                  ? "ring-2 ring-primary shadow-md"
                  : "hover:ring-1 hover:ring-primary/50"
              }`
        }`}
        onClick={() => toggleStyle(style.id, style.premium)}
        onMouseEnter={() => !isLocked && setHoveredStyle(style.id)}
        onMouseLeave={() => setHoveredStyle(null)}
      >
        {/* Preview Video */}
        <div className="relative aspect-[9/16] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
          {style.previewVideo ? (
            <>
              <video
                src={style.previewVideo}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted
                playsInline
                autoPlay={isHovered && !isLocked}
              />
              {isHovered && !isLocked && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 pointer-events-none"></div>
              )}
            </>
          ) : (
            <>
              {isHovered && !isLocked ? (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                    <p className="text-white text-sm font-medium">
                      Preview Style
                    </p>
                  </div>
                </div>
              ) : (
                <span className="text-6xl opacity-20">{style.icon}</span>
              )}
            </>
          )}
          {isSelected && (
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center z-20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{style.icon}</span>
            <h4 className="font-semibold text-sm">{style.name}</h4>
            {isLocked && (
              <Crown className="w-3.5 h-3.5 text-amber-500 ml-auto" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{style.desc}</p>
        </div>
      </Card>
    );
  };

  if (isPrefillingFromCampaign) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <div className="container mx-auto px-6 py-12 mt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading campaign data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {campaignId ? "Generate More Ads" : "Generate AI Ads"}
          </h1>
          <p className="text-muted-foreground">
            Upload product photos, choose styles, and let AI create engaging
            videos
          </p>
        </div>

        {/* Credits Bar */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Available Credits
                </p>
                <p className="text-2xl font-bold">{userCredits}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <Crown className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="text-2xl font-bold capitalize">
                  {userPlan?.plan || "Free"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Product Images - Always Visible */}
          <Card className="p-6">
            <Label className="text-lg mb-4 block">Product Photos *</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {productImages.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border-2"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {productImages.length < MAX_IMAGES && (
                <label className="aspect-square rounded-lg border-2 border-dashed hover:border-primary transition-all flex flex-col items-center justify-center bg-muted/30 hover:bg-muted cursor-pointer">
                  {isUploading ? (
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                      <p className="text-xs text-center">Upload</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          </Card>

          {/* Video Styles - Always Visible & Prominent */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg">Choose Video Styles *</Label>
              <span className="text-sm text-muted-foreground">
                {selectedStyles.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {videoStyles.map((style) => (
                <StyleCard key={style.id} style={style} />
              ))}
            </div>
          </Card>

          {/* Collapsible Sections */}
          <CollapsibleSection
            id="video"
            title="Video Settings"
            icon={<Film className="w-5 h-5 text-primary" />}
            badge={`${selectedQuality} • ${selectedDuration}s • ${
              languages.find((l) => l.code === selectedLanguage)?.flag
            }`}
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className={`p-4 cursor-pointer ${
                    selectedQuality === "720p" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedQuality("720p")}
                >
                  <p className="font-medium">720p HD</p>
                  <p className="text-xs text-muted-foreground">Standard</p>
                </Card>
                <Card
                  className={`p-4 ${
                    canUse1080p
                      ? `cursor-pointer ${
                          selectedQuality === "1080p"
                            ? "ring-2 ring-primary"
                            : ""
                        }`
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => canUse1080p && setSelectedQuality("1080p")}
                >
                  <div className="flex items-center gap-2">
                    <p className="font-medium">1080p</p>
                    {!canUse1080p && (
                      <Crown className="w-3 h-3 text-amber-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">High quality</p>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Card
                  className={`p-4 cursor-pointer ${
                    selectedDuration === 10 ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedDuration(10)}
                >
                  <p className="font-medium">10 seconds</p>
                </Card>
                <Card
                  className={`p-4 ${
                    canUse15sec
                      ? `cursor-pointer ${
                          selectedDuration === 15 ? "ring-2 ring-primary" : ""
                        }`
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => canUse15sec && setSelectedDuration(15)}
                >
                  <div className="flex items-center gap-2">
                    <p className="font-medium">15 seconds</p>
                    {!canUse15sec && (
                      <Crown className="w-3 h-3 text-amber-500" />
                    )}
                  </div>
                </Card>
              </div>

              {/* Language Selector */}
              <div>
                <Label className="mb-2 block text-sm">Video Language</Label>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleSection>
          <CollapsibleSection
            id="basic"
            title="Basic Info (Optional)"
            icon={<Info className="w-5 h-5 text-primary" />}
            badge="Product details"
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          >
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block text-sm">Campaign Name</Label>
                <Input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Summer Sale 2024"
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  className="resize-none h-24"
                />
              </div>
            </div>
          </CollapsibleSection>
          <CollapsibleSection
            id="style"
            title="Style & Audio (Optional)"
            icon={<Palette className="w-5 h-5 text-muted-foreground" />}
            badge={`${subtitlesEnabled ? "Subtitles" : ""}${
              subtitlesEnabled && musicEnabled ? " • " : ""
            }${musicEnabled ? "Music" : ""}${
              !subtitlesEnabled && !musicEnabled ? "Default settings" : ""
            }`}
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          >
            <div className="space-y-4">
              {/* <div className="bg-muted/30 border border-muted rounded-lg p-3 mb-4">
                <p className="text-sm text-muted-foreground">
                  ℹ️ These settings are optional. AI will use smart defaults if
                  you don't customize them.
                </p>
              </div> */}

              {/* Main Subtitles Toggle Card */}
              <Card
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  subtitlesEnabled
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        subtitlesEnabled
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <Type className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Subtitles</p>
                      <p className="text-xs text-muted-foreground">
                        {subtitlesEnabled
                          ? "Style settings are active"
                          : "Enable burned-in captions for your video"}
                      </p>
                    </div>
                  </div>
                  <Checkbox
                    checked={subtitlesEnabled}
                    onCheckedChange={(c) => setSubtitlesEnabled(c as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Expanded options - only visible when subtitlesEnabled is true */}
                {subtitlesEnabled && (
                  <div
                    className="mt-4 pt-4 border-t grid grid-cols-2 gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-1.5">
                      <Label className="text-[11px] uppercase font-bold text-muted-foreground">
                        Subtitle Style
                      </Label>
                      <Select
                        value={subtitleStyle}
                        onValueChange={setSubtitleStyle}
                      >
                        <SelectTrigger className="w-full bg-background h-9 text-sm">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {subtitleStyles.map((style) => (
                            <SelectItem key={style.id} value={style.id}>
                              {style.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] uppercase font-bold text-muted-foreground">
                        Color Palette
                      </Label>
                      <Select
                        value={colorScheme}
                        onValueChange={setColorScheme}
                      >
                        <SelectTrigger className="w-full bg-background h-9 text-sm">
                          <SelectValue placeholder="Select colors" />
                        </SelectTrigger>
                        <SelectContent>
                          {colorSchemes.map((scheme) => (
                            <SelectItem key={scheme.id} value={scheme.id}>
                              {scheme.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </Card>

              {/* Music Card */}
              <Card
                className={`p-4 cursor-pointer transition-colors ${
                  musicEnabled
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => setMusicEnabled(!musicEnabled)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        musicEnabled
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {musicEnabled ? (
                        <Volume2 className="w-5 h-5" />
                      ) : (
                        <VolumeX className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Background Music</p>
                      <p className="text-xs text-muted-foreground">
                        {musicEnabled
                          ? "Music will be added to your video"
                          : "Enable background music for your video"}
                      </p>
                    </div>
                  </div>
                  <Checkbox
                    checked={musicEnabled}
                    onCheckedChange={(c) => setMusicEnabled(c as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </Card>
            </div>
          </CollapsibleSection>
        </div>

        {/* Generate Button - Always Visible at Bottom */}

        <Card className="p-6 mt-6 bottom-4 shadow-lg border-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-lg">Ready to Generate</p>
              <p className="text-sm text-muted-foreground">
                {selectedStyles.length > 0 ? (
                  <>
                    Creating {selectedStyles.length} video
                    {selectedStyles.length !== 1 ? "s" : ""} • {selectedQuality}{" "}
                    • {selectedDuration}s
                  </>
                ) : (
                  "Select at least one video style to continue"
                )}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Videos</p>
                <p className="text-2xl font-bold text-green-600">
                  {creditsNeeded}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Credits</p>
                <p
                  className={`text-2xl font-bold ${
                    creditsNeeded > userCredits
                      ? "text-destructive"
                      : "text-primary"
                  }`}
                >
                  {creditsNeeded} / {userCredits}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/my-ads")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              className="flex-1 gap-2"
              disabled={!canGenerate || productImages.length === 0}
              size="lg"
            >
              <Wand2 className="w-5 h-5" />
              Generate {creditsNeeded > 0 ? creditsNeeded : ""} Video
              {creditsNeeded !== 1 ? "s" : ""}
            </Button>
          </div>

          {creditsNeeded > userCredits && (
            <p className="text-sm text-destructive text-center mt-3">
              ⚠️ Insufficient credits - you need {creditsNeeded - userCredits}{" "}
              more
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="min-h-screen bg-background">
    <DashboardNavbar />
    <div className="container mx-auto px-6 py-12 mt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  </div>
);

const GenerateAd = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GenerateAdContent />
    </Suspense>
  );
};

export default GenerateAd;
