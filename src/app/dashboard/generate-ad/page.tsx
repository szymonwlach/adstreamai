"use client";
import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  useCallback,
  useMemo,
} from "react";
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
  Camera,
  Lightbulb,
  Monitor,
  Clock,
  Lock,
  LockOpen,
  Zap,
  CircleChevronLeft,
  Target,
  MessageSquare,
  Megaphone,
  Users,
  Flame,
  ArrowRight,
  Star,
  Smile,
  Briefcase,
  Gem,
  PartyPopper,
  Package,
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
import { Badge } from "@/components/ui/badge";
import { DashboardNavbar } from "@/components/dashboardPage/DashboardNavbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ==================== CREDIT CALCULATION ====================
const CREDIT_COSTS = {
  "720p": {
    10: 15,
    15: 25,
  },
  "1080p": {
    10: 75,
    15: 135,
  },
  ultra: {
    10: 160,
    15: 300,
  },
} as const;

type QualityType = keyof typeof CREDIT_COSTS;
type DurationType = keyof (typeof CREDIT_COSTS)["720p"];

const calculateCost = (quality: string, duration: number): number => {
  const q = quality as QualityType;
  const d = duration as DurationType;
  return CREDIT_COSTS[q]?.[d] || 0;
};

// ==================== TYPES ====================
interface UserPlan {
  plan: "free" | "starter" | "pro" | "enterprise";
  credits: number;
}

// ==================== QUALITY OPTIONS ====================
const QUALITY_OPTIONS = [
  {
    id: "720p",
    name: "720p HD",
    subtitle: "Sora 2 Standard",
    icon: Monitor,
    locked: false,
    badge: null,
  },
  {
    id: "1080p",
    name: "1080p Full HD",
    subtitle: "Sora 2 Pro",
    icon: Monitor,
    locked: true,
    badge: "PRO",
  },
  {
    id: "ultra",
    name: "Ultra 4K",
    subtitle: "Sora 2 Pro High",
    icon: Monitor,
    locked: true,
    badge: "PRO",
  },
];

const DURATION_OPTIONS = [
  { id: 10, label: "10 seconds", icon: Clock },
  { id: 15, label: "15 seconds", icon: Clock, badge: "PRO" },
];

// ==================== SUBTITLE STYLES ====================
const SUBTITLE_STYLES = [
  {
    id: "karaoke",
    name: "Karaoke (TikTok)",
    desc: "Word-by-word highlight animation",
    preview: "🎤",
  },
  {
    id: "modern",
    name: "Modern Bold",
    desc: "Large, high-contrast text",
    preview: "💪",
  },
  {
    id: "minimal",
    name: "Clean Minimal",
    desc: "Simple, elegant captions",
    preview: "✨",
  },
  {
    id: "caption",
    name: "Caption Box",
    desc: "Background panel for clarity",
    preview: "📦",
  },
];

const COLOR_SCHEMES = [
  { id: "auto", name: "Auto (AI)", desc: "AI picks best colors" },
  { id: "vibrant", name: "Vibrant", desc: "Bold yellows & reds" },
  { id: "pastel", name: "Pastel", desc: "Soft, gentle colors" },
  { id: "dark", name: "Dark Mode", desc: "White text on dark" },
  { id: "neon", name: "Neon", desc: "Bright glowing colors" },
];

// ==================== TONE OF VOICE OPTIONS ====================
const TONE_OPTIONS = [
  {
    id: "casual",
    name: "Casual & Friendly",
    icon: Smile,
    desc: "Relaxed, approachable, conversational",
    example: '"Hey! Check this out..."',
  },
  {
    id: "professional",
    name: "Professional",
    icon: Briefcase,
    desc: "Polished, trustworthy, authoritative",
    example: '"Discover the solution..."',
  },
  {
    id: "playful",
    name: "Playful & Fun",
    icon: PartyPopper,
    desc: "Energetic, humorous, entertaining",
    example: '"Wait till you see this! 🔥"',
  },
  {
    id: "luxury",
    name: "Luxury & Premium",
    icon: Gem,
    desc: "Sophisticated, exclusive, elegant",
    example: '"Experience excellence..."',
  },
  {
    id: "urgent",
    name: "Urgent & Bold",
    icon: Flame,
    desc: "FOMO-driven, action-oriented, direct",
    example: '"Don\'t miss out! Limited time..."',
  },
];

// ==================== CTA SUGGESTIONS ====================
const CTA_SUGGESTIONS = [
  "Shop Now",
  "Learn More",
  "Get Yours Today",
  "Try It Free",
  "Limited Offer",
  "Order Now",
  "Discover More",
  "Join Now",
  "Start Free Trial",
  "Get Started",
  "Claim Your Discount",
  "Buy Now",
];

// ==================== HOOK SUGGESTIONS ====================
const HOOK_SUGGESTIONS = [
  "Stop scrolling! This changes everything...",
  "You need to see this before it's too late",
  "This is the [product] everyone's talking about",
  "I wish I knew about this sooner",
  "POV: You discover the perfect [product]",
  "Wait... it does WHAT?!",
  "The secret nobody tells you about [problem]",
  "Before vs After using this",
  "Why is nobody talking about this?",
  "This solved my biggest problem",
];

// ==================== ALLOWED IMAGE TYPES ====================
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_IMAGE_EXTENSIONS = ".jpg,.jpeg,.png";

// ==================== WORD COUNT HELPER ====================
const countWords = (text: string): number => {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
};

// ==================== COLLAPSIBLE SECTION ====================
const CollapsibleSection = ({
  id,
  title,
  icon,
  children,
  badge,
  expandedSection,
  setExpandedSection,
  lockButton,
}: {
  id: string;
  title: string;
  icon: any;
  children: React.ReactNode;
  badge?: string;
  expandedSection: string | null;
  setExpandedSection: (id: string | null) => void;
  lockButton?: React.ReactNode;
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
        <div className="flex items-center gap-2">
          {lockButton}
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 pt-0 border-t" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </Card>
  );
};

// ==================== WORD COUNT BADGE ====================
const WordCountBadge = ({
  text,
  max,
  label,
}: {
  text: string;
  max: number;
  label: string;
}) => {
  const count = countWords(text);
  const isOver = count > max;
  const isNearLimit = count >= max - 1 && count <= max;

  if (count === 0) return null;

  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
        isOver
          ? "bg-destructive/15 text-destructive"
          : isNearLimit
            ? "bg-amber-500/15 text-amber-600"
            : "bg-green-500/15 text-green-600"
      }`}
    >
      {count}/{max} words {isOver ? "⚠️ too long" : "✓"}
    </span>
  );
};

// ==================== MAIN COMPONENT ====================
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
  const [selectedQuality, setSelectedQuality] = useState<QualityType>("720p");
  const [selectedDuration, setSelectedDuration] = useState<DurationType>(10);

  // ==================== DYNAMIC WORD LIMITS ====================
  const hookMaxWords = selectedDuration === 15 ? 15 : 10;
  const ctaMaxWords = selectedDuration === 15 ? 7 : 5;
  const [userCredits, setUserCredits] = useState(0);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [isPrefillingFromCampaign, setIsPrefillingFromCampaign] =
    useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // ==================== CREATIVE CONTROLS ====================
  const [selectedTone, setSelectedTone] = useState<string>("casual");
  const [customHook, setCustomHook] = useState("");
  const [callToAction, setCallToAction] = useState("");

  // ==================== CREATIVE CONTROLS LOCK ====================
  const [creativeControlsLocked, setCreativeControlsLocked] = useState(false);
  const [isTogglingLock, setIsTogglingLock] = useState(false);

  // ==================== VIDEO ENHANCEMENTS ====================
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [subtitleStyle, setSubtitleStyle] = useState("karaoke");
  const [colorScheme, setColorScheme] = useState("auto");
  const [musicEnabled, setMusicEnabled] = useState(false);

  const [expandedSection, setExpandedSection] = useState<string | null>(
    "video",
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
      id: "product_showcase",
      name: "Studio Focus",
      desc: "Clean, professional product shots",
      icon: "📦",
      premium: false,
      category: "ecommerce",
      previewVideo: "/previews_video/product_showcase.mp4",
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
      id: "cinematic_luxury",
      name: "Cinematic Luxury",
      desc: "Slow motion, premium lighting",
      icon: "💎",
      premium: true,
      category: "premium",
      previewVideo: "/previews_video/luxury_watch.mp4",
    },
    {
      id: "stop_motion",
      name: "Stop-Motion",
      desc: "Playful, frame-by-frame animation",
      icon: "🧱",
      premium: true,
      category: "creative",
      previewVideo: "/previews_video/stop_motion.mp4",
    },
    {
      id: "before_after",
      name: "Transformation (Before/After)",
      desc: "Proven result transformation",
      icon: "🔄",
      premium: true,
      category: "ecommerce",
      previewVideo: "/previews_video/before_after.mp4",
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      desc: "Product in real-world scenarios",
      icon: "✨",
      premium: true,
      category: "ecommerce",
      previewVideo: "/previews_video/lifestyle.mp4",
    },
    {
      id: "unboxing",
      name: "Unboxing",
      desc: "First impression & reveal experience",
      icon: "🎁",
      premium: true,
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

  // ==================== CREDIT CALCULATION ====================
  const estimatedCost = useMemo(() => {
    const costPerVideo = calculateCost(selectedQuality, selectedDuration);
    const totalVideos = selectedStyles.length;
    return costPerVideo * totalVideos;
  }, [selectedQuality, selectedDuration, selectedStyles.length]);

  // ==================== PLAN RESTRICTIONS ====================
  const isFreeUser =
    userPlan?.plan === "free" || userPlan?.plan === "starter" || !userPlan;
  const canUse1080p = !isFreeUser;
  const canUseUltra = !isFreeUser;
  const canUse15sec = !isFreeUser;

  const hasSubscription = userPlan?.plan && userPlan.plan !== "free";

  // ==================== FETCH USER PLAN ====================
  const getPlan = async () => {
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

      const data = await response.json();
      setUserPlan(data);
      setUserCredits(data.credits || 0);
    } catch (error) {
      console.error("❌ Failed to get user plan:", error);
      setUserPlan({ plan: "free", credits: 0 });
      setUserCredits(0);
    }
  };

  // ==================== TOGGLE CREATIVE CONTROLS LOCK ====================
  const toggleCreativeLock = useCallback(async () => {
    const newLockState = !creativeControlsLocked;

    if (!campaignId) {
      setCreativeControlsLocked(newLockState);
      toast.success(
        newLockState
          ? "🔒 Creative Controls locked — will be saved when you generate"
          : "🔓 Creative Controls unlocked",
      );
      return;
    }

    setIsTogglingLock(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch("/api/updateCampaign", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_id: campaignId,
          user_id: session?.user.id,
          creative_controls_locked: newLockState,
        }),
      });

      if (!response.ok) throw new Error("Failed to update campaign");

      setCreativeControlsLocked(newLockState);

      toast.success(
        newLockState
          ? "🔒 Creative Controls locked — these settings will be reused next time"
          : "🔓 Creative Controls unlocked — AI will decide on its own next time",
      );
    } catch (error) {
      console.error("❌ Failed to toggle lock:", error);
      toast.error("Failed to save lock state");
    } finally {
      setIsTogglingLock(false);
    }
  }, [campaignId, creativeControlsLocked]);

  // ==================== PREFILL FROM CAMPAIGN ====================
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

        const campaignResponse = await fetch(
          `/api/getCampaigns?user_id=${session?.user.id}`,
        );
        const campaignData = await campaignResponse.json();
        const campaign = campaignData.campaigns.find(
          (c: any) => c.id === campaignId,
        );

        if (!campaign) {
          toast.error("Campaign not found");
          return;
        }

        const isLocked = campaign.creative_controls_locked ?? false;
        setCreativeControlsLocked(isLocked);

        const projectResponse = await fetch(
          `/api/getProjects?campaign_id=${campaignId}&user_id=${session?.user.id}`,
        );
        const projectData = await projectResponse.json();
        const lastProject = projectData.projects?.[0];

        // Product info always prefills from campaign
        setCampaignName(campaign.name || "");
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

        if (lastProject) {
          if (lastProject.language) setSelectedLanguage(lastProject.language);
          if (lastProject.quality)
            setSelectedQuality(lastProject.quality as QualityType);
          if (lastProject.duration)
            setSelectedDuration(lastProject.duration as DurationType);
          if (lastProject.subtitles_enabled !== undefined)
            setSubtitlesEnabled(lastProject.subtitles_enabled);
          if (lastProject.subtitle_style)
            setSubtitleStyle(lastProject.subtitle_style);
          if (lastProject.color_scheme)
            setColorScheme(lastProject.color_scheme);
          if (lastProject.music_enabled !== undefined)
            setMusicEnabled(lastProject.music_enabled);
          if (lastProject.selected_styles?.length > 0)
            setSelectedStyles(lastProject.selected_styles);

          // Creative Controls — only prefill if locked
          if (isLocked) {
            if (lastProject.tone_of_voice)
              setSelectedTone(lastProject.tone_of_voice);
            if (lastProject.custom_hook) setCustomHook(lastProject.custom_hook);
            if (lastProject.call_to_action)
              setCallToAction(lastProject.call_to_action);
          }

          toast.success(
            isLocked
              ? "Campaign loaded • Creative Controls loaded from previous ad"
              : "Campaign loaded • Creative Controls empty (AI will decide)",
          );
        } else {
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

  // ==================== QUALITY SELECTION ====================
  const handleQualitySelect = (qualityId: string) => {
    if (qualityId === "1080p" && !canUse1080p) {
      toast.warning("Premium Feature", {
        description: "Upgrade to Pro to unlock 1080p Full HD quality!",
        icon: <Crown className="w-5 h-5 text-amber-500" />,
        action: {
          label: "Upgrade",
          onClick: () => router.push("/dashboard/billing"),
        },
      });
      return;
    }
    if (qualityId === "ultra" && !canUseUltra) {
      toast.warning("Premium Feature", {
        description: "Upgrade to Pro to unlock Ultra 4K quality!",
        icon: <Crown className="w-5 h-5 text-amber-500" />,
        action: {
          label: "Upgrade",
          onClick: () => router.push("/dashboard/billing"),
        },
      });
      return;
    }
    setSelectedQuality(qualityId as QualityType);
  };

  // ==================== DURATION SELECTION ====================
  const handleDurationSelect = (duration: number) => {
    if (duration === 15 && !canUse15sec) {
      toast.warning("Premium Feature", {
        description: "Upgrade to Pro to unlock 15-second videos!",
        icon: <Crown className="w-5 h-5 text-amber-500" />,
        action: {
          label: "Upgrade",
          onClick: () => router.push("/dashboard/pricing"),
        },
      });
      return;
    }
    setSelectedDuration(duration as DurationType);
  };

  // ==================== STYLE TOGGLE ====================
  const toggleStyle = useCallback(
    (styleId: string, isPremium: boolean) => {
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
          : [...prev, styleId],
      );
    },
    [isFreeUser, router],
  );

  // ==================== IMAGE UPLOAD ====================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const allFiles = Array.from(e.target.files || []);
    if (allFiles.length === 0) return;

    // Filter only JPG/JPEG/PNG — reject WebP and other formats
    const files = allFiles.filter((file) =>
      ALLOWED_IMAGE_TYPES.includes(file.type),
    );

    const rejectedCount = allFiles.length - files.length;
    if (rejectedCount > 0) {
      toast.error(
        `${rejectedCount} plik${rejectedCount > 1 ? "i zostały pominięte" : " został pominięty"} — obsługiwane formaty to tylko JPG i PNG (WebP nie jest obsługiwany)`,
      );
    }

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
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
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
        const withoutPreviews = prev.slice(0, -files.length);
        return [...withoutPreviews, ...uploadedUrls];
      });

      toast.success(
        `${files.length} image${files.length > 1 ? "s" : ""} uploaded`,
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

  // ==================== GENERATION ====================
  const hasEnoughCredits = userCredits >= estimatedCost;
  const canGenerate =
    hasEnoughCredits && selectedStyles.length > 0 && productImages.length > 0;

  const handleGenerate = async () => {
    // Guard: prevent multiple simultaneous generations
    if (isGenerating) return;

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
    if (!hasEnoughCredits) {
      toast.error("Insufficient Credits", {
        description: `You need ${estimatedCost - userCredits} more credits`,
        action: {
          label: "Get Credits",
          onClick: () => router.push("/dashboard/pricing"),
        },
      });
      return;
    }

    setIsGenerating(true);

    try {
      const projectData = {
        user_id: session.user.id,
        product_url: productImages,
        selected_style: selectedStyles,
        name: campaignName.trim() || null,
        description: description.trim() || null,
        language: selectedLanguage,
        quality: selectedQuality,
        duration: selectedDuration,
        campaign_id: campaignId && campaignId.trim() !== "" ? campaignId : null,
        estimated_cost: estimatedCost,
        tone_of_voice: selectedTone,
        custom_hook: customHook.trim() || null,
        call_to_action: callToAction.trim() || null,
      };

      const saveResponse = await fetch("/api/saveAd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(
          errorData.details || errorData.error || "Failed to save project",
        );
      }

      const { projectIds, campaignId: newCampaignId } =
        await saveResponse.json();

      if (creativeControlsLocked && newCampaignId && !campaignId) {
        try {
          const {
            data: { session: lockSession },
          } = await supabase.auth.getSession();
          await fetch("/api/updateCampaign", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              campaign_id: newCampaignId,
              user_id: lockSession?.user.id,
              creative_controls_locked: true,
            }),
          });
        } catch (e) {
          console.error("Failed to save lock state:", e);
        }
      }

      const costPerVideo = calculateCost(selectedQuality, selectedDuration);
      const successfulProjects = [];
      const failedProjects = [];
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      for (let i = 0; i < projectIds.length; i++) {
        const projectId = projectIds[i];
        const style = selectedStyles[i];

        const n8nPayload = {
          project_id: projectId,
          campaign_id: newCampaignId,
          user_id: session.user.id,
          plan: userPlan?.plan,
          product_name: campaignName.trim() || "Setting up your campaign...",
          description: description.trim() || undefined,
          product_images: productImages,
          selected_styles: [style],
          language:
            languages.find((l) => l.code === selectedLanguage)?.name ||
            "English",
          quality: selectedQuality,
          duration: selectedDuration,
          estimated_cost: costPerVideo,
          tone_of_voice: selectedTone,
          custom_hook: customHook.trim() || null,
          call_to_action: callToAction.trim() || null,
        };

        try {
          const n8nResponse = await fetch("/api/sendToN8n", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(n8nPayload),
          });

          const responseText = await n8nResponse.text();
          let n8nData;
          try {
            n8nData = JSON.parse(responseText);
          } catch {
            throw new Error(
              `Invalid JSON response from n8n: ${responseText.substring(0, 100)}`,
            );
          }

          if (!n8nResponse.ok) {
            // Critical error from n8n — stop everything immediately
            const errMsg =
              typeof n8nData?.error === "string"
                ? n8nData.error
                : typeof n8nData?.message === "string"
                  ? n8nData.message
                  : "Generation failed";
            toast.error(`Generation error: ${errMsg}`, {
              description: "No videos were generated. Please try again.",
            });
            setIsGenerating(false);
            return;
          }

          successfulProjects.push({ projectId, style });
          if (i < projectIds.length - 1) await delay(500);
        } catch (error) {
          // Network or parse error — stop immediately
          const errMsg = error instanceof Error ? error.message : String(error);
          toast.error("Generation failed", {
            description: errMsg || "Please try again or contact support.",
          });
          setIsGenerating(false);
          return;
        }
      }

      if (successfulProjects.length > 0) {
        const totalCost = costPerVideo * successfulProjects.length;
        const successfulProjectIds = successfulProjects.map((p) => p.projectId);

        try {
          const deductResponse = await fetch("/api/deductCredits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: session.user.id,
              credits_to_deduct: totalCost,
              project_ids: successfulProjectIds,
            }),
          });

          const deductData = await deductResponse.json();

          if (!deductResponse.ok) {
            toast.error("Credits deduction failed", {
              description: "Please contact support",
            });
          } else {
            setUserCredits(deductData.new_credits);
            toast.success(
              `${successfulProjects.length} ad${successfulProjects.length !== 1 ? "s" : ""} ${
                campaignId ? "added to campaign" : "campaign created"
              }!`,
            );
          }
        } catch {
          toast.error("Failed to deduct credits", {
            description:
              "Videos were generated but credits weren't deducted. Contact support.",
          });
        }
      }

      if (failedProjects.length > 0 && successfulProjects.length === 0) {
        toast.error("Failed to generate ads", {
          description:
            "Please try again or contact support if the issue persists",
        });
        setIsGenerating(false);
        return;
      }

      router.push("/dashboard/my-ads?refresh=true");
    } catch (error) {
      console.error("❌ Error in handleGenerate:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to generate ads", { description: errorMessage });
      setIsGenerating(false);
    }
  };

  // ==================== STYLE CARD ====================
  const StyleCard = React.memo(
    ({
      style,
      isSelected,
      onToggle,
    }: {
      style: any;
      isSelected: boolean;
      onToggle: (styleId: string, isPremium: boolean) => void;
    }) => {
      const isLocked = style.premium && isFreeUser;

      return (
        <Card
          className={`relative overflow-hidden transition-all duration-200 cursor-pointer ${
            isLocked
              ? "opacity-60 hover:opacity-70"
              : `hover:shadow-md hover:scale-[1.01] ${
                  isSelected
                    ? "ring-2 ring-primary shadow-md bg-primary/5"
                    : "hover:ring-1 hover:ring-primary/30"
                }`
          }`}
          onClick={() => onToggle(style.id, style.premium)}
        >
          <div className="relative p-4 flex flex-col items-center justify-center min-h-[100px] bg-gradient-to-br from-muted/50 to-muted/30">
            {isLocked && (
              <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
              </div>
            )}
            <div
              className={`text-3xl mb-2 transition-transform ${isSelected && !isLocked ? "scale-110" : ""}`}
            >
              {style.icon}
            </div>
            {isSelected && !isLocked && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
            {isLocked && (
              <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Crown className="w-2.5 h-2.5 text-amber-500" />
                <span className="text-[8px] font-bold text-amber-600 uppercase">
                  Pro
                </span>
              </div>
            )}
          </div>
          <div className="p-3 pt-2 border-t">
            <h4 className="font-semibold text-xs mb-0.5">{style.name}</h4>
            <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
              {style.desc}
            </p>
          </div>
        </Card>
      );
    },
  );

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

  const getVideoSettingsBadge = () => {
    const parts = [];
    parts.push(selectedQuality.toUpperCase());
    parts.push(`${selectedDuration}s`);
    parts.push(languages.find((l) => l.code === selectedLanguage)?.flag || "");
    return parts.join(" • ");
  };

  const creativeLockButton = creativeControlsLocked ? (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-semibold text-amber-600">
      <Lock className="w-3 h-3" />
      <span>Locked</span>
    </div>
  ) : undefined;

  const getCreativeControlsBadge = () => {
    if (creativeControlsLocked) return "🔒 Locked";
    const filled = [customHook, callToAction].filter(Boolean).length;
    if (filled === 0) return "AI will decide everything";
    if (filled === 1) return "1 hint set • AI fills the rest";
    return "Hook + CTA set • Tone: " + selectedTone;
  };

  // ==================== PRODUCT INFO BADGE ====================
  const getProductInfoBadge = () => {
    if (campaignName && description) return campaignName;
    if (campaignName) return `${campaignName} • no description`;
    if (description) return "No name • AI will generate one";
    return "Both optional — AI generates from your photos";
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <div className="fixed top-20 left-5 z-50">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <CircleChevronLeft size={30} />
        </button>
      </div>
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
          <Card className="p-5 relative overflow-hidden">
            {hasSubscription && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl animate-pulse" />
            )}
            <div className="flex items-center gap-4 relative z-10">
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
          {/* ==================== PRODUCT INFO (always visible, top) ==================== */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Product Info</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getProductInfoBadge()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Product / Campaign Name
                  <span className="ml-2 text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                    Optional
                  </span>
                </Label>
                <Input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., BLAST Electrolyte Drink — leave empty and AI will name it"
                />
              </div>

              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Product Description
                  <span className="ml-2 text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                    Optional
                  </span>
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Advanced electrolyte drink for fitness — or leave empty and AI will write it from your photos"
                  className="resize-none h-24"
                />
                {!campaignName && !description && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    AI will generate both from your product photos automatically
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Product Images */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <Label className="text-lg">Product Photos *</Label>
              {productImages.length > 0 && productImages.length < 4 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <Lightbulb className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-medium text-blue-600">
                    Add more angles for better results
                  </span>
                </div>
              )}
            </div>

            {productImages.length === 0 && (
              <div className="mb-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Camera className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      💡 Pro Tip: Upload 3-5 photos for best results
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Include different angles: front view, side view, close-up
                      details, lifestyle shots, packaging. More variety = better
                      AI-generated videos!
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      📎 Supported formats: JPG, JPEG, PNG (WebP not supported)
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                      <p className="text-xs text-center px-2">
                        {productImages.length === 0 ? "Add photos" : "Add more"}
                      </p>
                      <p className="text-[9px] text-muted-foreground text-center px-1 mt-0.5">
                        JPG, PNG only
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept={ALLOWED_IMAGE_EXTENSIONS}
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>

            {productImages.length > 0 && productImages.length < MAX_IMAGES && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                {productImages.length}/{MAX_IMAGES} photos • More angles =
                Better AI results
              </p>
            )}
          </Card>

          {/* Video Styles */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Label className="text-lg font-semibold">
                  Choose Video Styles *
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Select multiple styles to create variety (each style =
                  separate video)
                </p>
              </div>
              <div className="flex items-center gap-2">
                {selectedStyles.length > 0 && (
                  <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-sm font-semibold text-primary">
                      {selectedStyles.length} style
                      {selectedStyles.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px bg-border flex-1" />
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Free Styles
                  </h3>
                  <div className="h-px bg-border flex-1" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {videoStyles
                    .filter((s) => !s.premium)
                    .map((style) => (
                      <StyleCard
                        key={style.id}
                        style={style}
                        isSelected={selectedStyles.includes(style.id)}
                        onToggle={toggleStyle}
                      />
                    ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px bg-border flex-1" />
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Premium Styles
                    </h3>
                  </div>
                  <div className="h-px bg-border flex-1" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {videoStyles
                    .filter((s) => s.premium)
                    .map((style) => (
                      <StyleCard
                        key={style.id}
                        style={style}
                        isSelected={selectedStyles.includes(style.id)}
                        onToggle={toggleStyle}
                      />
                    ))}
                </div>
              </div>
            </div>

            {selectedStyles.length === 0 && (
              <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-dashed">
                <p className="text-xs text-muted-foreground text-center">
                  💡 Tip: Select multiple styles to generate different versions
                  of your ad
                </p>
              </div>
            )}
          </Card>

          {/* Video Settings */}
          <CollapsibleSection
            id="video"
            title="Video Settings"
            icon={<Film className="w-5 h-5 text-primary" />}
            badge={getVideoSettingsBadge()}
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          >
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <Label className="text-sm font-semibold">Video Quality</Label>
                  <span className="text-xs text-muted-foreground">
                    {calculateCost(selectedQuality, selectedDuration)} credits
                    per video
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {QUALITY_OPTIONS.map((quality) => {
                    const isLocked =
                      (quality.id === "1080p" && !canUse1080p) ||
                      (quality.id === "ultra" && !canUseUltra);
                    const isSelected = selectedQuality === quality.id;
                    return (
                      <Card
                        key={quality.id}
                        className={`p-3 cursor-pointer transition-all ${
                          isLocked
                            ? "opacity-50 cursor-not-allowed"
                            : `hover:shadow-md ${isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-accent/50"}`
                        }`}
                        onClick={() => handleQualitySelect(quality.id)}
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <quality.icon className="w-4 h-4 text-muted-foreground" />
                          {isLocked && (
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          {quality.badge && !isLocked && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
                              {quality.badge}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-xs">{quality.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {quality.subtitle}
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <Label className="text-sm font-semibold">
                    Video Duration
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Longer videos = More engagement
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {DURATION_OPTIONS.map((duration) => {
                    const isLocked = duration.id === 15 && !canUse15sec;
                    const isSelected = selectedDuration === duration.id;
                    return (
                      <Card
                        key={duration.id}
                        className={`p-3 cursor-pointer transition-all ${
                          isLocked
                            ? "opacity-50 cursor-not-allowed"
                            : `hover:shadow-md ${isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-accent/50"}`
                        }`}
                        onClick={() => handleDurationSelect(duration.id)}
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <duration.icon className="w-4 h-4 text-muted-foreground" />
                          {isLocked && (
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          {duration.badge && !isLocked && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
                              {duration.badge}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-sm">
                          {duration.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {calculateCost(
                            selectedQuality,
                            duration.id as DurationType,
                          )}{" "}
                          credits
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="mb-2 block text-sm font-semibold">
                  Video Language
                </Label>
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

          {/* ==================== CREATIVE CONTROLS ==================== */}
          <CollapsibleSection
            id="creative"
            title="Creative Controls"
            icon={<MessageSquare className="w-5 h-5 text-amber-500" />}
            badge={getCreativeControlsBadge()}
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
            lockButton={creativeLockButton}
          >
            <div className="space-y-5">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/8 border border-blue-500/20">
                <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All fields are <strong>optional</strong>. Leave them empty and
                  AI will write everything based on your product photos and
                  selected style. Fill in only what matters most to you.
                </p>
              </div>

              {/* TONE */}
              <div>
                <Label className="mb-2 text-sm font-semibold flex items-center gap-2">
                  <Smile className="w-4 h-4" />
                  Tone of Voice
                </Label>
                <div
                  className={`grid grid-cols-2 md:grid-cols-3 gap-2.5 ${creativeControlsLocked ? "opacity-60 pointer-events-none" : ""}`}
                >
                  {TONE_OPTIONS.map((tone) => {
                    const isSelected = selectedTone === tone.id;
                    const ToneIcon = tone.icon;
                    return (
                      <Card
                        key={tone.id}
                        className={`p-3 cursor-pointer transition-all ${
                          isSelected
                            ? "ring-2 ring-primary bg-primary/5"
                            : "hover:bg-accent/50 hover:shadow-md"
                        }`}
                        onClick={() =>
                          !creativeControlsLocked && setSelectedTone(tone.id)
                        }
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <ToneIcon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-xs leading-tight">
                              {tone.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                              {tone.desc}
                            </p>
                          </div>
                        </div>
                        <div className="text-[9px] text-muted-foreground italic bg-muted/50 p-1.5 rounded">
                          {tone.example}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* HOOK */}
              <div>
                <Label className="mb-2 text-sm font-semibold flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Opening Hook
                  <Badge variant="secondary" className="text-[9px]">
                    First 2-3 seconds
                  </Badge>
                  {customHook && (
                    <WordCountBadge
                      text={customHook}
                      max={hookMaxWords}
                      label="hook"
                    />
                  )}
                </Label>
                <Textarea
                  value={customHook}
                  onChange={(e) => setCustomHook(e.target.value)}
                  placeholder='Optional — e.g., "Stop scrolling! This changes everything..." Leave empty and AI will write a hook for you.'
                  className="resize-none h-20 text-sm"
                  disabled={creativeControlsLocked}
                />
                {!creativeControlsLocked && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <p className="text-xs text-muted-foreground w-full mb-1">
                      Quick suggestions:
                    </p>
                    {HOOK_SUGGESTIONS.slice(0, 4).map((suggestion, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setCustomHook(suggestion)}
                      >
                        {suggestion.substring(0, 32)}...
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div>
                <Label className="mb-2 text-sm font-semibold flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  Call to Action
                  <Badge variant="secondary" className="text-[9px]">
                    Last second
                  </Badge>
                  {callToAction && (
                    <WordCountBadge
                      text={callToAction}
                      max={ctaMaxWords}
                      label="CTA"
                    />
                  )}
                </Label>
                <Input
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  placeholder='Optional — e.g., "Shop Now". Leave empty and AI will pick the best CTA.'
                  className="text-sm"
                  disabled={creativeControlsLocked}
                />
                {!creativeControlsLocked && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <p className="text-xs text-muted-foreground w-full mb-1">
                      Quick picks:
                    </p>
                    {CTA_SUGGESTIONS.slice(0, 6).map((cta, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setCallToAction(cta)}
                      >
                        {cta}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Lock / Unlock */}
              <div className="pt-2 border-t">
                {creativeControlsLocked ? (
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-amber-500/20 mt-0.5 flex-shrink-0">
                          <Lock className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-amber-800 mb-1">
                            🔒 Settings saved — will be used in the next ad
                          </p>
                          <p className="text-xs text-amber-700 leading-relaxed">
                            These settings are saved and will be{" "}
                            <strong>used automatically</strong> next time you
                            generate an ad in this campaign. Unlock if you want
                            AI to decide on its own instead.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleCreativeLock}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-amber-400/50 text-xs font-semibold text-amber-700 hover:bg-white whitespace-nowrap transition-all flex-shrink-0"
                      >
                        <LockOpen className="w-3.5 h-3.5" />
                        Unlock
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/15">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-primary/10 mt-0.5 flex-shrink-0">
                          <LockOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-1">
                            Want to reuse these settings next time?
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Click <strong>"Keep these settings"</strong> and
                            next time you generate an ad in this campaign, tone,
                            hook and CTA will be pre-filled automatically.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleCreativeLock}
                        disabled={isTogglingLock}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 whitespace-nowrap transition-all flex-shrink-0 disabled:opacity-50"
                      >
                        {isTogglingLock ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Lock className="w-3.5 h-3.5" />
                        )}
                        Keep these settings
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* Generate Button */}
        <Card className="p-6 mt-6 shadow-lg border-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-lg">Ready to Generate</p>
              <p className="text-sm text-muted-foreground">
                {selectedStyles.length > 0 ? (
                  <>
                    Creating {selectedStyles.length} video
                    {selectedStyles.length !== 1 ? "s" : ""} •{" "}
                    {selectedQuality.toUpperCase()} • {selectedDuration}s each
                  </>
                ) : (
                  "Select at least one video style to continue"
                )}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold text-primary flex items-center gap-1">
                  {estimatedCost}
                  <Zap className="w-5 h-5 text-amber-500" />
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <p
                  className={`text-2xl font-bold ${!hasEnoughCredits ? "text-destructive" : "text-green-600"}`}
                >
                  {userCredits}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/my-ads")}
              className="flex-1"
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              className="flex-1 gap-2"
              disabled={
                !canGenerate || productImages.length === 0 || isGenerating
              }
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {selectedStyles.length > 0
                    ? `Generate ${selectedStyles.length} Video${selectedStyles.length !== 1 ? "s" : ""} (${estimatedCost} credits)`
                    : "Generate Videos"}
                </>
              )}
            </Button>
          </div>

          {!hasEnoughCredits && selectedStyles.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive text-center font-medium">
                ⚠️ Insufficient credits - you need {estimatedCost - userCredits}{" "}
                more
              </p>
              <Button
                variant="link"
                className="w-full mt-2 text-destructive hover:text-destructive/80"
                onClick={() => router.push("/dashboard/billing")}
              >
                Get More Credits →
              </Button>
            </div>
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
