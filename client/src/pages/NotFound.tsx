import { Button } from "@/components/ui/button";
import { Compass, Home } from "lucide-react";
import { useLocation } from "wouter";
import { SEOHead } from "@/components/SEOHead";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-transparent">
      <SEOHead title="Page Not Found" canonical="/404" />
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-primary/80 backdrop-blur-md border border-secondary/30 flex items-center justify-center">
              <Compass className="w-12 h-12 text-secondary" />
            </div>
          </div>
        </div>

        {/* Text */}
        <p className="text-secondary font-sans text-sm tracking-widest uppercase mb-2 font-semibold">
          404 — Lost at Sea
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground font-sans leading-relaxed mb-10 max-w-md mx-auto">
          It looks like this page has sailed away. Let's get you back on course
          — your next adventure is just a click away.
        </p>

        {/* CTA */}
        <div
          id="not-found-button-group"
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            onClick={handleGoHome}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 rounded-xl font-sans font-bold"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
