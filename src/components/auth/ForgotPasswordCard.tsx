"use client";

import { useState } from "react";
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
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export function ForgotPasswordCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [touched, setTouched] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const getEmailError = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return "";
  };

  const handleResetPassword = async () => {
    setTouched(true);

    const emailError = getEmailError(email);
    if (emailError) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Email sent!",
        description: "Check your inbox for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const emailError = touched ? getEmailError(email) : "";

  if (emailSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription>
              We've sent password reset instructions to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              <Field>
                <FieldDescription className="text-center">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setEmailSent(false);
                      setTouched(false);
                    }}
                    className="underline text-primary hover:text-primary/80"
                  >
                    try another email
                  </button>
                </FieldDescription>
              </Field>

              <Field>
                <Button
                  onClick={() => router.push("/auth")}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
                </Button>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <FieldDescription className="text-center text-xs text-muted-foreground">
          The link will expire in 1 hour for security reasons.
        </FieldDescription>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleResetPassword();
                      }
                    }}
                    className={cn("pl-10", emailError && "border-destructive")}
                    disabled={loading}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                {emailError && (
                  <p className="text-sm text-destructive mt-1.5">
                    {emailError}
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
                      Sending email...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </Field>

              <Field>
                <Button
                  onClick={() => router.push("/auth")}
                  variant="ghost"
                  disabled={loading}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
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
