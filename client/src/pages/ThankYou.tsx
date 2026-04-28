import { useEffect } from "react";
import { useVideoHero } from "@/contexts/VideoHeroContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle, Clock, Mail, Calendar, ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

export function ThankYou() {
  const { setVideoContext } = useVideoHero();

  useEffect(() => {
    setVideoContext("thank-you");
  }, [setVideoContext]);

  return (
    <div
      className="min-h-dvh flex items-center justify-center px-4 py-10 sm:py-12"
      style={{
        background:
          "linear-gradient(to bottom, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.85) 100%)",
        paddingBottom: "max(2.5rem, calc(2rem + env(safe-area-inset-bottom, 0px)))",
        paddingTop: "max(2.5rem, calc(2rem + env(safe-area-inset-top, 0px)))",
      }}
    >
      <SEOHead
        title="Thank You — Your Trip Inquiry Was Received"
        description="Thank you for reaching out! Jessica at Next Chapter Travel will review your trip request and respond within 24 hours."
        canonical="/thank-you"
        noIndex
      />
      <div className="max-w-2xl w-full">
        {/* Success icon */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-secondary/20 rounded-full blur-2xl animate-pulse" />
            <CheckCircle className="w-20 h-20 sm:w-24 sm:h-24 text-secondary relative animate-in fade-in zoom-in duration-500" />
          </div>
        </div>

        {/* Main message */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-[2rem] leading-[1.1] sm:text-5xl font-serif font-bold text-white mb-3 sm:mb-4 tracking-tight">
            Thank You!
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-2">
            Your trip inquiry has been received.
          </p>
          <p className="text-base sm:text-lg text-secondary">
            Jessica is excited to help plan your perfect journey.
          </p>
        </div>

        {/* Next steps timeline */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 sm:p-8 mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl font-serif font-semibold text-white mb-6 sm:mb-8 flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary flex-shrink-0" />
            What Happens Next
          </h2>

          <div className="space-y-5 sm:space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-secondary text-primary font-semibold text-sm">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">
                  Jessica Reviews Your Request
                </h3>
                <p className="text-white/70 text-sm">
                  Within 24 hours, Jessica will review your trip details and
                  preferences.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-secondary text-primary font-semibold text-sm">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">
                  Initial Consultation
                </h3>
                <p className="text-white/70 text-sm">
                  Jessica will reach out via email or phone to discuss your
                  vision, budget, and travel style.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-secondary text-primary font-semibold text-sm">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">
                  Personalized Itinerary
                </h3>
                <p className="text-white/70 text-sm">
                  You'll receive a custom-crafted itinerary with flights,
                  accommodations, activities, and insider tips.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-secondary text-primary font-semibold text-sm">
                  4
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Portal Access</h3>
                <p className="text-white/70 text-sm">
                  You'll receive an invite to Jessica's client portal to track
                  your trip, access documents, and stay connected.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-secondary text-primary font-semibold text-sm">
                  5
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">
                  Enjoy Your Journey
                </h3>
                <p className="text-white/70 text-sm">
                  Depart with confidence. Jessica is available 24/7 for any
                  questions or changes during your trip.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact info cards */}
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {/* Email card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-5 sm:p-6 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-secondary" />
              <h3 className="font-semibold text-white">Email Jessica</h3>
            </div>
            <p className="text-white/70 text-sm mb-3">
              Response within 24 hours
            </p>
            <a
              href="mailto:seidersconsulting@gmail.com"
              className="text-secondary hover:text-secondary/80 transition-colors text-sm font-medium"
            >
              seidersconsulting@gmail.com
            </a>
          </div>

          {/* Calendar card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-5 sm:p-6 hover:bg-white/15 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-secondary" />
              <h3 className="font-semibold text-white">Schedule a Call</h3>
            </div>
            <p className="text-white/70 text-sm mb-3">
              Book a consultation directly
            </p>
            <a
              href="https://calendly.com/jessica-nextchapter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-secondary/80 transition-colors text-sm font-medium"
            >
              View Availability →
            </a>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 min-h-[52px] active:scale-[0.99] transition-transform"
            >
              Back to Home
            </Button>
          </Link>
          <Link href="/#features" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 min-h-[52px] active:scale-[0.99] transition-transform"
            >
              Learn More About Jessica
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Trust note */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            Your information is secure and will only be used to plan your trip.
          </p>
        </div>
      </div>
    </div>
  );
}
