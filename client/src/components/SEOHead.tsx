import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  /** Pass false to suppress the LocalBusiness JSON-LD block */
  includeLocalBusiness?: boolean;
  /** When true, emits `<meta name="robots" content="noindex, nofollow">` —
   * use for transactional pages like /thank-you, /join, and /404. */
  noIndex?: boolean;
}

const SITE_NAME = "Next Chapter Travel — Jessica Seiders";
const BASE_URL = "https://next-chapter-travel.netlify.app";
const DEFAULT_DESCRIPTION =
  "Jessica Seiders at Next Chapter Travel LLC creates unforgettable vacations — Disney, cruises, all-inclusive resorts, and more. Get a personal travel advisor, free of charge.";
const DEFAULT_OG_IMAGE = `${BASE_URL}/jesshero.jpeg`;

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Next Chapter Travel LLC",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.ico`,
  image: DEFAULT_OG_IMAGE,
  description: DEFAULT_DESCRIPTION,
  priceRange: "Free consultation",
  founder: {
    "@type": "Person",
    name: "Jessica Seiders",
    jobTitle: "Certified Travel Advisor & Founder",
    sameAs: [
      "https://www.facebook.com/nextchaptertravel",
      "https://www.instagram.com/nextchaptertravelllc",
    ],
  },
  sameAs: [
    "https://www.facebook.com/nextchaptertravel",
    "https://www.instagram.com/nextchaptertravelllc",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "seidersconsulting@gmail.com",
    contactType: "customer service",
    availableLanguage: "English",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Travel Planning Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Disney Vacation Planning" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Caribbean Cruise Planning" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "All-Inclusive Resort Booking" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Universal Studios Vacation" } },
    ],
  },
};

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLinkRel(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function injectJsonLd(id: string, data: object) {
  let serialized: string;
  try {
    serialized = JSON.stringify(data);
  } catch (err) {
    // Fail open — don't inject malformed structured data, but keep the page
    // rendering normally.
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[SEOHead] failed to serialize JSON-LD '${id}':`, err);
    }
    return;
  }
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    (el as HTMLScriptElement).type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = serialized;
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

/**
 * SEOHead — imperatively manages <title>, <meta>, <link rel="canonical">,
 * and JSON-LD structured data for each page without a third-party library.
 *
 * Usage:
 *   <SEOHead
 *     title="Plan My Trip"
 *     description="Tell Jessica about your dream vacation…"
 *     canonical="/plan-my-trip"
 *   />
 */
export function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  includeLocalBusiness = false,
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Standard meta
    setMeta("description", description);
    setMeta(
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow"
    );

    // Open Graph
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:type", ogType, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:image", fullOgImage, true);
    setMeta("og:site_name", SITE_NAME, true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", fullOgImage);

    // Canonical link
    setLinkRel("canonical", canonicalUrl);

    // JSON-LD
    if (includeLocalBusiness) {
      injectJsonLd("json-ld-local-business", LOCAL_BUSINESS_SCHEMA);
    } else {
      removeJsonLd("json-ld-local-business");
    }
  }, [fullTitle, description, canonicalUrl, fullOgImage, ogType, includeLocalBusiness, noIndex]);

  return null;
}
