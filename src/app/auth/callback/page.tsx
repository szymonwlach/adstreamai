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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center gap-6">
          {error ? (
            <>
              <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4">
                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Something went wrong
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {error}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
                  Redirecting in a moment...
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Signing you in...
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Verifying your credentials
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
