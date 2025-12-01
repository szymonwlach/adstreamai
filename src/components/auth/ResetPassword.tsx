"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";

export function ResetPasswordCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [passwordReset, setPasswordReset] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a valid recovery token in the URL hash
    const checkToken = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const type = hashParams.get("type");

      if (type === "recovery" && accessToken) {
        // Token is present, verify by getting session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (session && !error) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          toast({
            title: "Invalid or expired link",
            description: "Please request a new password reset link.",
            variant: "destructive",
          });
        }
      } else {
        setIsValidToken(false);
        toast({
          title: "Invalid link",
          description: "This password reset link is invalid.",
          variant: "destructive",
        });
      }
    };

    checkToken();
  }, [toast]);

  const getPasswordError = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "At least 8 characters required";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Include uppercase, lowercase & number";
    }
    return "";
  };

  const handleResetPassword = async () => {
    setTouched({ password: true, confirm: true });

    const passwordError = getPasswordError(password);
    if (passwordError) {
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setPasswordReset(true);
      toast({
        title: "Password updated!",
        description: "Your password has been successfully reset.",
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth");
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state while checking token
  if (isValidToken === null) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid token state
  if (isValidToken === false) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              <Field>
                <Button
                  onClick={() => router.push("/auth/forgot-password")}
                  className="w-full"
                >
                  Request new reset link
                </Button>
              </Field>

              <Field>
                <Button
                  onClick={() => router.push("/auth")}
                  variant="ghost"
                  className="w-full"
                >
                  Back to sign in
                </Button>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (passwordReset) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl">
              Password reset successful!
            </CardTitle>
            <CardDescription>
              Your password has been updated. Redirecting you to sign in...
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              <Field>
                <Button onClick={() => router.push("/auth")} className="w-full">
                  Sign in now
                </Button>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    );
  }

  const passwordError = touched.password ? getPasswordError(password) : "";
  const confirmError =
    touched.confirm && password !== confirmPassword
      ? "Passwords do not match"
      : "";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create new password</CardTitle>
          <CardDescription>
            Enter a new password for your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, password: true }))
                    }
                    className={cn(
                      "pl-10 pr-10",
                      passwordError && "border-destructive"
                    )}
                    disabled={loading}
                    autoComplete="new-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordError ? (
                  <p className="text-sm text-destructive mt-1.5">
                    {passwordError}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Min. 8 chars with uppercase, lowercase & number
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm New Password
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, confirm: true }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleResetPassword();
                      }
                    }}
                    className={cn(
                      "pl-10 pr-10",
                      confirmError && "border-destructive"
                    )}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {confirmError && (
                  <p className="text-sm text-destructive mt-1.5">
                    {confirmError}
                  </p>
                )}
              </Field>

              <Field>
                <Button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="text-center text-xs text-muted-foreground">
        Remember your password?{" "}
        <a
          href="/auth"
          className="underline hover:text-foreground text-primary"
        >
          Sign in
        </a>
      </FieldDescription>
    </div>
  );
}
