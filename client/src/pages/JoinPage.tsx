import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useVideoHero } from "@/contexts/VideoHeroContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { Loader2, CheckCircle, XCircle, Plane, Lock } from "lucide-react";

const JOIN_SEO = (
  <SEOHead
    title="Join Your Travel Portal"
    description="Activate your Next Chapter Travel client portal."
    canonical="/join"
    noIndex
  />
);

export default function JoinPage() {
  const [, navigate] = useLocation();
  const { setVideoContext } = useVideoHero();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  // Extract token from URL on mount; treat empty string as missing.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    setToken(t && t.trim().length > 0 ? t : null);
  }, []);

  useEffect(() => {
    setVideoContext("join");
  }, [setVideoContext]);

  // Validate the token. `enabled` ensures the query is skipped while token
  // is null, so the input value below is only consulted when defined.
  const { data: validation, isLoading: validating } = trpc.invites.validate.useQuery(
    { token: token ?? "" },
    { enabled: !!token, retry: 1 }
  );

  // Accept mutation (marks token as used)
  const acceptMutation = trpc.invites.accept.useMutation({
    onSuccess: () => {
      setAccepted(true);
      setTimeout(() => navigate("/portal"), 2000);
    },
  });

  // Auto-accept when user is authenticated and token is valid. Intentionally
  // omit `acceptMutation` from deps — its identity changes every render and
  // would re-fire the mutation; the `accepted` flag and `isPending` guard
  // below are sufficient.
  useEffect(() => {
    if (
      isAuthenticated &&
      validation?.valid &&
      !accepted &&
      !acceptMutation.isPending &&
      token
    ) {
      acceptMutation.mutate({ token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, validation?.valid, accepted, token]);

  const handleLogin = () => {
    // Pass the current URL as the return path so OAuth redirects back here
    // Store the return path so we can redirect back after OAuth
    sessionStorage.setItem(
      "invite_return_path",
      `/join${window.location.search}`
    );
    window.location.href = getLoginUrl();
  };

  if (!token) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-transparent px-4 py-8">
        {JOIN_SEO}
        <Card className="max-w-md w-full border-border/50 bg-card/95 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">
              Invalid Invite Link
            </h2>
            <p className="text-muted-foreground font-sans text-sm">
              This invite link is missing a token. Please check the link you
              received and try again.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="mt-6 font-sans"
              variant="outline"
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (validating || authLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-transparent px-4">
        {JOIN_SEO}
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-secondary mx-auto mb-4" />
          <p className="text-muted-foreground font-sans text-sm">
            Verifying your invite...
          </p>
        </div>
      </div>
    );
  }

  if (!validation?.valid) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-transparent px-4 py-8">
        {JOIN_SEO}
        <Card className="max-w-md w-full border-border/50 bg-card/95 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">
              Invite Unavailable
            </h2>
            <p className="text-muted-foreground font-sans text-sm mb-4">
              {validation?.reason ?? "This invite link is no longer valid."}
            </p>
            <p className="text-muted-foreground font-sans text-xs">
              Please contact Jessica at{" "}
              <a
                href="https://www.nextchaptertravel.com"
                className="text-secondary underline"
              >
                Next Chapter Travel
              </a>{" "}
              for a new invite.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="mt-6 font-sans"
              variant="outline"
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-transparent px-4 py-8">
        {JOIN_SEO}
        <Card className="max-w-md w-full border-border/50 bg-card/95 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">
              Welcome to Your Portal!
            </h2>
            <p className="text-muted-foreground font-sans text-sm mb-2">
              Your account is set up. Redirecting you to your travel portal...
            </p>
            <Loader2 className="w-5 h-5 animate-spin text-secondary mx-auto mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Token is valid — show welcome screen
  const invite = validation.invite;
  if (!invite) return null;

  return (
    <div className="min-h-dvh flex items-center justify-center bg-transparent px-4 py-8">
      {JOIN_SEO}
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/20 via-background to-secondary/10" />

      <Card className="max-w-md w-full border-border/50 bg-card/95 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-6 sm:p-8">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-primary" />
            </div>
            <p className="text-secondary font-sans text-xs tracking-widest uppercase mb-1">
              Next Chapter Travel
            </p>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              You're Invited!
            </h1>
          </div>

          {/* Invite details */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
            <p className="text-foreground font-sans text-sm leading-relaxed">
              {invite.name ? (
                <>
                  Hi <strong>{invite.name}</strong>! Jessica Seiders at Next
                  Chapter Travel has set up your personal travel portal.
                </>
              ) : (
                <>
                  Jessica Seiders at Next Chapter Travel has set up your
                  personal travel portal.
                </>
              )}
            </p>
            {invite.email && (
              <p className="text-muted-foreground font-sans text-xs mt-2">
                Invite sent to:{" "}
                <span className="text-foreground font-medium">
                  {invite.email}
                </span>
              </p>
            )}
          </div>

          {/* What they get */}
          <div className="space-y-2 mb-6">
            {[
              "Day-by-day itinerary for your trip",
              "All booking confirmations in one place",
              "Secure document vault",
              "Direct messaging with Jessica",
              "Smart packing checklist",
            ].map(feature => (
              <div key={feature} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-sm font-sans text-foreground">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          {!isAuthenticated ? (
            <div>
              <Button
                onClick={handleLogin}
                className="w-full bg-primary text-primary-foreground font-sans font-medium min-h-[52px] text-base rounded-xl active:scale-[0.99] transition-transform"
              >
                <Lock className="w-4 h-4 mr-2" />
                Sign In to Access Your Portal
              </Button>
              <p className="text-muted-foreground font-sans text-xs text-center mt-3">
                Secure sign-in powered by Manus OAuth
              </p>
            </div>
          ) : (
            <div>
              <Button
                onClick={() => {
                  if (token) acceptMutation.mutate({ token });
                }}
                disabled={acceptMutation.isPending || !token}
                className="w-full bg-primary text-primary-foreground font-sans font-medium min-h-[52px] text-base rounded-xl active:scale-[0.99] transition-transform"
              >
                {acceptMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Accept Invite & Open Portal
              </Button>
              <p className="text-muted-foreground font-sans text-xs text-center mt-3">
                Signed in as <strong>{user?.name}</strong>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
