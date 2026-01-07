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
  Plus,
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
      desc: "Authentic user-generated feel",
      icon: "👤",
      premium: false,
    },
    {
      id: "trend",
      name: "Trending",
      desc: "Based on viral trends",
      icon: "🔥",
      premium: true,
    },
    {
      id: "educational",
      name: "Educational",
      desc: "Informative & professional",
      icon: "🎓",
      premium: true,
    },
    {
      id: "testimonial",
      name: "Testimonial",
      desc: "Customer review style",
      icon: "⭐",
      premium: true,
    },
  ];

  const getPlan = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const response = await fetch("/api/getPlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          console.log("🔍 Loading campaign:", campaign);
          console.log("📸 Product images from DB:", campaign.product_image_url);

          setCampaignName(campaign.name);

          // Obsługa product_image_url - może być string, array, lub string z przecinkami
          let images: string[] = [];
          if (campaign.product_image_url) {
            if (Array.isArray(campaign.product_image_url)) {
              // Już jest tablicą
              images = campaign.product_image_url;
            } else if (typeof campaign.product_image_url === "string") {
              // Jeśli zawiera przecinki, rozdziel
              if (campaign.product_image_url.includes(",")) {
                images = campaign.product_image_url
                  .split(",")
                  .map((url: string) => url.trim());
              } else {
                // Pojedynczy URL
                images = [campaign.product_image_url];
              }
            }
          }

          console.log("✅ Parsed images array:", images);
          setProductImages(images);
          setDescription(campaign.description || "");

          toast.success("Campaign loaded!", {
            description: `Generating more ads for "${campaign.name}"`,
          });
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
        description:
          "Upgrade to Premium to unlock all video styles and create diverse content!",
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
      console.log("💾 Saving project to database...");

      const projectData = {
        user_id: session.user.id,
        name: campaignName.trim() || undefined,
        description: description.trim() || undefined,
        product_url: productImages,
        selected_style: selectedStyles,
        language: selectedLanguage,
        quality: selectedQuality,
        duration: selectedDuration,
        campaign_id: campaignId || undefined,
      };

      const cleanedData = Object.fromEntries(
        Object.entries(projectData).filter(([_, v]) => v !== undefined)
      );

      const saveResponse = await fetch("/api/saveAd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(
          errorData.details || errorData.error || "Failed to save project"
        );
      }

      const { projectId, campaignId: newCampaignId } =
        await saveResponse.json();

      // 🔥 KLUCZOWA ZMIANA: Najpierw wysyłamy do n8n
      console.log("📤 Sending to n8n...");
      const n8nResponse = await fetch("/api/sendToN8n", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          campaign_id: newCampaignId,
          plan: userPlan,
          product_name: campaignName.trim() || undefined,
          user_id: session.user.id,
          description: description.trim() || undefined,
          product_images: productImages,
          selected_styles: selectedStyles,
          language:
            languages.find((l) => l.code === selectedLanguage)?.name ||
            "English",
          quality: selectedQuality,
          duration: selectedDuration,
        }),
      });

      const n8nData = await n8nResponse.json();

      if (!n8nResponse.ok) {
        // 🔥 Jeśli n8n zwróci błąd, musimy usunąć zapisany projekt
        console.error("❌ n8n error, rolling back...");

        // Wywołaj API do usunięcia projektu (musisz stworzyć ten endpoint)
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

      // ✅ Sukces - wszystko poszło dobrze
      console.log("✅ Success!");

      if (campaignId) {
        toast.success("More ads are being generated!", {
          description: `Creating ${selectedStyles.length} new video${
            selectedStyles.length > 1 ? "s" : ""
          } for your campaign.`,
        });
      } else {
        toast.success("Campaign created & ads generating!", {
          description: `Creating ${selectedStyles.length} video${
            selectedStyles.length > 1 ? "s" : ""
          }. Check 'My Campaigns' in a few minutes.`,
        });
      }

      router.push("/dashboard/my-ads?refresh=true");
    } catch (error) {
      console.error("❌ Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to generate ads", {
        description: errorMessage,
      });
    }
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
      <div className="container mx-auto px-4 py-8 max-w-4xl mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {campaignId ? "Generate More Ads" : "Generate AI Ads"}
          </h1>
          <p className="text-muted-foreground">
            {campaignId
              ? "Add more ads to your existing campaign"
              : "Upload your product photos and let AI create engaging ad content"}
          </p>
        </div>

        {campaignId && (
          <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">
                  Generating for existing campaign
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Product info is pre-filled. Just select video styles and
                  settings.
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <div className="space-y-6">
            {/* Credits Display */}
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Available Credits</p>
                  <p className="text-2xl font-bold text-primary">
                    {userCredits}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Will Use</p>
                <p className="text-2xl font-bold">{creditsNeeded}</p>
              </div>
            </div>

            {/* Campaign Name */}
            <div>
              <Label htmlFor="campaign-name" className="text-base mb-3 block">
                Campaign Name
                <span className="text-muted-foreground font-normal ml-2">
                  (optional)
                </span>
              </Label>
              {campaignId && campaignName && (
                <p className="text-sm text-muted-foreground mb-3">
                  ✓ Using name from campaign. Edit if needed.
                </p>
              )}
              <Input
                id="campaign-name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g., Summer Sale 2024, New Product Launch"
                className="text-base"
              />
              <p className="text-xs text-muted-foreground mt-2">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Leave empty and AI will generate a creative campaign name
                  based on your product images
                </span>
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-base mb-3 block">
                Product Photos * (up to {MAX_IMAGES})
              </Label>
              {campaignId && productImages.length > 0 && (
                <p className="text-sm text-muted-foreground mb-3">
                  ✓ Using {productImages.length} image
                  {productImages.length > 1 ? "s" : ""} from campaign. Upload
                  more or remove existing ones.
                </p>
              )}

              <div className="grid grid-cols-3 gap-3">
                {productImages.map((image, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border-2 border-border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {productImages.length < MAX_IMAGES && (
                  <label
                    htmlFor="image-upload"
                    className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary transition-all flex flex-col items-center justify-center bg-muted/50 hover:bg-muted cursor-pointer group"
                  >
                    {isUploading ? (
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                        <p className="text-xs font-medium text-center px-2">
                          {productImages.length === 0
                            ? "Upload photos"
                            : "Add more"}
                        </p>
                        <p className="text-[10px] text-muted-foreground text-center px-2 mt-1">
                          PNG, JPG • Multiple
                        </p>
                      </>
                    )}
                    <input
                      id="image-upload"
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
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-base mb-3 block">
                Product Description
                <span className="text-muted-foreground font-normal ml-2">
                  (optional)
                </span>
              </Label>
              {campaignId && description && (
                <p className="text-sm text-muted-foreground mb-3">
                  ✓ Using description from campaign. Edit if needed.
                </p>
              )}
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product features, benefits, and target audience..."
                className="min-h-32 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Leave empty and AI will analyze your product images to create
                  a compelling description and ad copy
                </span>
              </p>
            </div>

            {/* Language Selection */}
            <div>
              <Label
                htmlFor="language"
                className="text-base mb-3 flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Ad Language
              </Label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger id="language" className="w-full">
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

            {/* Video Quality & Duration */}
            <div className="space-y-4">
              <div>
                <Label className="text-base mb-3 block">Video Quality</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Card
                    className={`p-4 cursor-pointer transition-all hover:border-primary ${
                      selectedQuality === "720p"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => {
                      setSelectedQuality("720p");
                      setSelectedDuration(10);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedQuality === "720p"}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">720p HD</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Standard quality
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className={`p-4 transition-all ${
                      canUse1080p
                        ? `cursor-pointer hover:border-primary ${
                            selectedQuality === "1080p"
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`
                        : "opacity-50 cursor-not-allowed border-border bg-muted/50"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (canUse1080p) {
                        setSelectedQuality("1080p");
                      } else {
                        toast.warning("Premium Feature", {
                          description: "Upgrade to Premium for 1080p!",
                          icon: <Crown className="w-5 h-5 text-amber-500" />,
                          action: {
                            label: "Upgrade",
                            onClick: () => router.push("/dashboard/pricing"),
                          },
                        });
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedQuality === "1080p" && canUse1080p}
                        disabled={!canUse1080p}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">1080p Full HD</h3>
                          {!canUse1080p && (
                            <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-medium">
                              PREMIUM
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          High quality
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div>
                <Label className="text-base mb-3 block">Video Duration</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Card
                    className={`p-4 cursor-pointer transition-all hover:border-primary ${
                      selectedDuration === 10
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => setSelectedDuration(10)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedDuration === 10}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">10 seconds</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Quick & engaging
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className={`p-4 transition-all ${
                      canUse15sec
                        ? `cursor-pointer hover:border-primary ${
                            selectedDuration === 15
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`
                        : "opacity-50 cursor-not-allowed border-border bg-muted/50"
                    }`}
                    onClick={() => {
                      if (canUse15sec) {
                        setSelectedDuration(15);
                      } else {
                        toast.warning("Premium Feature", {
                          description: isFreeUser
                            ? "Upgrade for 15-second videos!"
                            : "Select 1080p to unlock 15s",
                        });
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedDuration === 15}
                        disabled={!canUse15sec}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">15 seconds</h3>
                          {!canUse15sec && (
                            <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-medium">
                              PREMIUM
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          More storytelling
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Video Styles */}
            <div>
              <Label className="text-base mb-4 block">
                Select Video Styles *
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Choose one or more styles (1 credit per style). Each style
                creates a separate video.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {videoStyles.map((style) => {
                  const isSelected = selectedStyles.includes(style.id);
                  const isLocked = style.premium && isFreeUser;

                  return (
                    <Card
                      key={style.id}
                      className={`p-4 transition-all ${
                        isLocked
                          ? "opacity-50 cursor-not-allowed"
                          : `cursor-pointer hover:border-primary ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`
                      }`}
                      onClick={() => toggleStyle(style.id, style.premium)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected && !isLocked}
                          disabled={isLocked}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{style.icon}</span>
                            <h3 className="font-semibold">{style.name}</h3>
                            {isLocked && (
                              <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-medium">
                                PREMIUM
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {style.desc}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground">
                {selectedStyles.length === 0 ? (
                  "Select at least one video style to continue"
                ) : (
                  <>
                    <span className="text-primary font-medium">
                      {selectedStyles.length} video
                      {selectedStyles.length !== 1 ? "s" : ""} will be generated
                    </span>
                    {productImages.length > 1 && (
                      <span> from {productImages.length} images</span>
                    )}
                    {" • "}
                    <span
                      className={
                        creditsNeeded > userCredits
                          ? "text-destructive"
                          : "text-foreground"
                      }
                    >
                      {creditsNeeded} credit{creditsNeeded !== 1 ? "s" : ""}{" "}
                      will be used
                    </span>
                    {creditsNeeded > userCredits && (
                      <span className="block mt-2 text-destructive">
                        ⚠️ Insufficient credits
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
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
                disabled={productImages.length === 0 || !canGenerate}
              >
                <Wand2 className="w-4 h-4" />
                Generate {creditsNeeded} Video{creditsNeeded !== 1 ? "s" : ""} (
                {creditsNeeded} {creditsNeeded === 1 ? "credit" : "credits"})
              </Button>
            </div>
          </div>
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
