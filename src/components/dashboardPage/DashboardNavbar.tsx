// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Menu, LogOut } from "lucide-react";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { supabase } from "@/integrations/supabase/client";
// import { User } from "@supabase/supabase-js";
// import Link from "next/link";

// export const DashboardNavbar = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [open, setOpen] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user ?? null);
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const handleSignOut = async () => {
//     await supabase.auth.signOut();
//     setOpen(false);
//     router.push("/");
//   };

//   const handleAuthClick = () => {
//     setOpen(false);
//     router.push("/auth");
//   };

//   const handleLogoClick = () => {
//     router.push("/");
//   };

//   const handleNavClick = () => {
//     setOpen(false);
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/80">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//             <div
//               className="flex-shrink-0 cursor-pointer"
//               onClick={handleLogoClick}
//             >
//               <h1 className="text-2xl font-bold">
//                 <span className="text-gradient">AdStream</span>AI
//               </h1>
//             </div>
//           </div>

//           {/* Desktop menu */}
//           <div className="hidden md:block">
//             <div className="flex items-center space-x-8">
//               <a
//                 href="/dashboard"
//                 className="text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 Home
//               </a>
//               <Link
//                 href="/dashboard/my-ads"
//                 className="text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 My Ads
//               </Link>
//               <a
//                 href="/dashboard/billing"
//                 className="text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 Billing
//               </a>
//               <a
//                 href="/dashboard#connect"
//                 className="text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 Connection
//               </a>
//               {user ? (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="rounded-lg"
//                   onClick={handleSignOut}
//                 >
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Sign Out
//                 </Button>
//               ) : (
//                 <>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="rounded-lg"
//                     onClick={handleAuthClick}
//                   >
//                     Sign In
//                   </Button>
//                   <Button
//                     size="sm"
//                     className="bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-lg"
//                     onClick={handleAuthClick}
//                   >
//                     Get Started
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Mobile menu */}
//           <div className="md:hidden">
//             <Sheet open={open} onOpenChange={setOpen}>
//               <SheetTrigger asChild>
//                 <Button variant="ghost" size="icon">
//                   <Menu className="h-6 w-6" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="right" className="w-[300px] sm:w-[400px]">
//                 <SheetHeader>
//                   <SheetTitle>Menu</SheetTitle>
//                 </SheetHeader>
//                 <div className="flex flex-col space-y-4 mt-8">
//                   <a
//                     href="/dashboard"
//                     className="text-lg font-medium hover:text-primary transition-colors"
//                     onClick={handleNavClick}
//                   >
//                     Home
//                   </a>
//                   <Link
//                     href="/dashboard/my-ads"
//                     className="text-lg font-medium hover:text-primary transition-colors"
//                     onClick={handleNavClick}
//                   >
//                     My Ads
//                   </Link>
//                   <a
//                     href="/dashboard/billing"
//                     className="text-lg font-medium hover:text-primary transition-colors"
//                     onClick={handleNavClick}
//                   >
//                     Billing
//                   </a>
//                   <a
//                     href="/dashboard#connect"
//                     className="text-lg font-medium hover:text-primary transition-colors"
//                     onClick={handleNavClick}
//                   >
//                     Connection
//                   </a>

//                   <div className="pt-6 space-y-3 border-t">
//                     {user ? (
//                       <Button
//                         variant="outline"
//                         className="w-full rounded-lg"
//                         onClick={handleSignOut}
//                       >
//                         <LogOut className="w-4 h-4 mr-2" />
//                         Sign Out
//                       </Button>
//                     ) : (
//                       <>
//                         <Button
//                           variant="outline"
//                           className="w-full rounded-lg"
//                           onClick={handleAuthClick}
//                         >
//                           Sign In
//                         </Button>
//                         <Button
//                           className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-lg"
//                           onClick={handleAuthClick}
//                         >
//                           Get Started
//                         </Button>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

export const DashboardNavbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                console.log("Menu clicked, current state:", mobileMenuOpen);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
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
  );
};
