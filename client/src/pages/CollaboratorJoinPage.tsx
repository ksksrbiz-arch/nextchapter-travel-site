import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { Loader2, CheckCircle, XCircle, Users, Lock } from "lucide-react";

const SEO = (
  <SEOHead
    title="Join Trip Collaboration"
    description="Accept your invitation to co-edit a Next Chapter Travel itinerary."
    canonical="/collaborate"
    noIndex
  />
);

export default function CollaboratorJoinPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    setToken(t && t.trim().length > 0 ? t : null);
  }, []);

  const { data: validation, isLoading: validating } =
    trpc.collaborators.validate.useQuery(
      { token: token ?? "" },
      { enabled: !!token, retry: 1 }
    );

  const acceptMutation = trpc.collaborators.accept.useMutation({
    onSuccess: data => {
      setAccepted(true);
      setTimeout(
        () => navigate(`/admin/trips/${data.tripId}`),
        1500
      );
    },
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {SEO}
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="font-serif text-xl font-semibold mb-2">
              Missing invite token
            </h1>
            <p className="text-sm text-muted-foreground font-sans">
              The collaboration link is incomplete. Please use the full URL from
              your email.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (validating || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {SEO}
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!validation?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {SEO}
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="font-serif text-xl font-semibold mb-2">
              Invite not available
            </h1>
            <p className="text-sm text-muted-foreground font-sans">
              {validation?.reason ?? "Token not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {SEO}
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-4">
          <Users className="w-12 h-12 text-primary mx-auto" />
          <h1 className="font-serif text-2xl font-semibold">
            Co-edit this itinerary
          </h1>
          <p className="text-sm text-muted-foreground font-sans">
            You've been invited to{" "}
            <Badge variant="outline">{validation.collaborator?.role}</Badge>{" "}
            this trip alongside Jessica.
          </p>

          {accepted ? (
            <div className="space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="font-sans text-sm">
                Welcome aboard! Redirecting to the trip…
              </p>
            </div>
          ) : isAuthenticated ? (
            <Button
              onClick={() => acceptMutation.mutate({ token })}
              disabled={acceptMutation.isPending}
              className="w-full"
            >
              {acceptMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Accept invitation
            </Button>
          ) : (
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>
                <Lock className="w-4 h-4 mr-2" /> Sign in to accept
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
