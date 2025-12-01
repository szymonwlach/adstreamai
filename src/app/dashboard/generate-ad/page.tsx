"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DashboardNavbar } from "@/components/dashboardPage/DashboardNavbar";

const GenerateAd = () => {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [userCredits, setUserCredits] = useState(10);
  const router = useRouter();

  const videoStyles = [
    {
      id: "ugc",
      name: "UGC Style",
      desc: "Authentic user-generated feel",
      icon: "👤",
    },
    {
      id: "trend",
      name: "Trending",
      desc: "Based on viral trends",
      icon: "🔥",
    },
    {
      id: "educational",
      name: "Educational",
      desc: "Informative & professional",
      icon: "🎓",
    },
    {
      id: "testimonial",
      name: "Testimonial",
      desc: "Customer review style",
      icon: "⭐",
    },
  ];

  const toggleStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((id) => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = () => {
    setDescription(
      "Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals."
    );
  };

  const creditsNeeded = selectedStyles.length;
  const canGenerate = userCredits >= creditsNeeded && creditsNeeded > 0;

  const handleGenerate = () => {
    // Tu będzie logika generowania i zapisywania do bazy
    // Na razie przekierowanie do My Ads
    router.push("/dashboard/my-ads");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="container mx-auto px-6 py-12 mt-16">
        <Card className="max-w-3xl mx-auto p-8 bg-card border-border">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Generate AI Videos</h2>
            <p className="text-muted-foreground">
              Upload your product photo and let AI create engaging video
              content. You can choose where to post them later.
            </p>
          </div>

          {/* Credits Display */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Available Credits
                </p>
                <p className="text-2xl font-bold text-primary">{userCredits}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Will Use</p>
                <p className="text-2xl font-bold">{creditsNeeded}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label className="text-base block">Product Photo</Label>
              <p className="text-muted-foreground mb-4 text-sm">
                Upload a clean photo with your product centered on a plain
                background. Good lighting and sharp focus help your ad stand
                out!
              </p>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt="Product"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm font-medium mb-1">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base">Product Description</Label>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleGenerateDescription}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product features, benefits, and target audience..."
                className="min-h-32 resize-none"
              />
            </div>

            {/* Video Styles */}
            <div>
              <Label className="text-base mb-4 block">
                Select Video Styles
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Choose one or more styles. Each style generates a unique video
                (1 credit per style).
              </p>
              <div className="grid grid-cols-2 gap-3">
                {videoStyles.map((style) => {
                  const isSelected = selectedStyles.includes(style.id);
                  return (
                    <Card
                      key={style.id}
                      className={`p-4 cursor-pointer transition-all hover:border-primary ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                      onClick={() => toggleStyle(style.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox checked={isSelected} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{style.icon}</span>
                            <h3 className="font-semibold">{style.name}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {style.desc}
                          </p>
                          <p className="text-xs text-primary mt-2">1 credit</p>
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
                      {selectedStyles.length} video(s) will be generated
                    </span>
                    {" • "}
                    <span
                      className={
                        creditsNeeded > userCredits
                          ? "text-destructive"
                          : "text-foreground"
                      }
                    >
                      {creditsNeeded} credit(s) will be used
                    </span>
                    {creditsNeeded > userCredits && (
                      <span className="block mt-2 text-destructive">
                        ⚠️ Insufficient credits. You need{" "}
                        {creditsNeeded - userCredits} more.
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>

            {/* Info box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex gap-3">
                <span className="text-xl">💡</span>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">What happens next?</p>
                  <p className="text-sm text-muted-foreground">
                    Your videos will be generated and saved to "My Content".
                    From there, you can preview them, connect your social
                    accounts, and choose where to post each video.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                className="flex-1 gap-2"
                disabled={!productImage || !description || !canGenerate}
              >
                <Wand2 className="w-4 h-4" />
                Generate Videos ({creditsNeeded}{" "}
                {creditsNeeded === 1 ? "credit" : "credits"})
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GenerateAd;
