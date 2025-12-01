"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  return (
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

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#platforms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Platforms
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
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

          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
