"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        const code = searchParams.get("code");
        const error_code = searchParams.get("error");
        const error_description = searchParams.get("error_description");

        if (error_code) {
          setError(error_description || "An error occurred during login");
          setTimeout(() => router.replace("/auth?error=oauth_failed"), 3000);
          return;
        }

        if (!code) {
          setTimeout(() => router.replace("/auth?error=no_code"), 2000);
          return;
        }

        const { data, error } = await supabase.auth.exchangeCodeForSession(
          code
        );

        if (error) {
          setError(error.message);
          setTimeout(() => router.replace("/auth?error=oauth_failed"), 3000);
          return;
        }

        if (data?.session?.user) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          router.replace("/dashboard");
        } else {
          setTimeout(() => router.replace("/auth?error=no_session"), 2000);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(errorMsg);
        setTimeout(() => router.replace("/auth?error=exception"), 3000);
      }
    };

    handleOAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4">
      <div className="relative">
        {/* Animated background blur */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20 animate-pulse" />

        {/* Main card */}
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-md w-full border border-white/20 dark:border-slate-700/50">
          <div className="flex flex-col items-center gap-8">
            {error ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30 animate-pulse" />
                  <div className="relative bg-gradient-to-br from-red-500 to-rose-600 rounded-full p-5 shadow-lg">
                    <AlertCircle className="w-14 h-14 text-white" />
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    Authentication Failed
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {error}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Redirecting...
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse" />
                  <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-5 shadow-lg">
                    <Loader2 className="w-14 h-14 animate-spin text-white" />
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    Authenticating
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Please wait while we verify your credentials
                  </p>
                  <div className="flex items-center justify-center gap-1.5 mt-6">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-5 shadow-lg">
              <Loader2 className="w-14 h-14 animate-spin text-white" />
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
