"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  LogOut,
  X,
  Settings,
  Trash2,
  Mail,
  User,
  Upload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";
import { toast } from "sonner";

interface UserProfile {
  display_name: string | null;
  avatar_url: string | null;
}

export const DashboardNavbar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    display_name: null,
    avatar_url: null,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.email!);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.email!);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (email: string) => {
    try {
      const response = await fetch(
        `/api/user/profile?email=${encodeURIComponent(email)}`,
      );
      if (response.ok) {
        const data = await response.json();
        setUserProfile({
          display_name: data.display_name,
          avatar_url: data.avatar_url,
        });
        setDisplayName(data.display_name || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleAuthClick = () => {
    router.push("/auth");
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      toast.success("Account marked for deletion", {
        description:
          "Your account will be permanently deleted in 30 days. Contact us if you want to restore it.",
      });

      await handleSignOut();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("An error occurred while deleting your account", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with new avatar URL
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          avatar_url: publicUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setUserProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          display_name: displayName || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setUserProfile((prev) => ({
        ...prev,
        display_name: displayName || null,
      }));
      setShowProfileDialog(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (userProfile.display_name) {
      return userProfile.display_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0].toUpperCase() || "?";
  };

  const getDisplayName = () => {
    return userProfile.display_name || user?.email?.split("@")[0] || "User";
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div
                className="flex-shrink-0 cursor-pointer"
                onClick={handleLogoClick}
              >
                <h1 className="text-2xl font-bold">
                  <span className="text-gradient">AdStream</span>AI
                </h1>
              </div>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <a
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </a>
                <Link
                  href="/dashboard/my-ads"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Ads
                </Link>
                <a
                  href="/dashboard/billing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Billing
                </a>
                <a
                  href="/dashboard#connect"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Connection
                </a>
                {user ? (
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-10 w-10 rounded-full"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={userProfile.avatar_url || undefined}
                              alt={getDisplayName()}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white">
                              {getInitials()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {getDisplayName()}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setShowProfileDialog(true)}
                          className="cursor-pointer"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a
                            href="mailto:contact@adstreamai.com"
                            className="flex items-center cursor-pointer"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Contact
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setShowDeleteDialog(true)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleSignOut}
                          className="cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={handleAuthClick}
                    >
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-lg"
                      onClick={handleAuthClick}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden border-t border-border/50 transition-all duration-300 ease-in-out ${
              mobileMenuOpen
                ? "max-h-screen opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user && (
                <div className="flex items-center space-x-3 px-3 py-3 mb-2 bg-accent/10 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={userProfile.avatar_url || undefined}
                      alt={getDisplayName()}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {getDisplayName()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              )}
              <a
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <Link
                href="/dashboard/my-ads"
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Ads
              </Link>
              <a
                href="/dashboard/billing"
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Billing
              </a>
              <a
                href="/dashboard#connect"
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connection
              </a>
              {user && (
                <>
                  <div className="border-t border-border/50 my-2 pt-2">
                    <button
                      onClick={() => {
                        setShowProfileDialog(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                    <a
                      href="mailto:contact@adstreamai.com"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </a>
                    <button
                      onClick={() => {
                        setShowDeleteDialog(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </button>
                  </div>
                </>
              )}
              <div className="pt-4 space-y-2">
                {user ? (
                  <Button
                    variant="outline"
                    className="w-full rounded-lg"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full rounded-lg"
                      onClick={() => {
                        handleAuthClick();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-lg"
                      onClick={() => {
                        handleAuthClick();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete your account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark your account for deletion. Your account will
              be permanently deleted from the database in 30 days. If you change
              your mind during this time, please contact us at{" "}
              <a
                href="mailto:contact@adstreamai.com"
                className="text-primary hover:underline"
              >
                contact@adstreamai.com
              </a>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your display name and profile picture
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={userProfile.avatar_url || undefined}
                  alt={getDisplayName()}
                />
                <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
                <Label
                  htmlFor="avatar"
                  className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Avatar"}
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="Enter your display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowProfileDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
