import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  /** Pass false to suppress the LocalBusiness JSON-LD block */
  includeLocalBusiness?: boolean;
}

const SITE_NAME = "Next Chapter Travel — Jessica Seiders";
const BASE_URL = "https://nextchaptertravel.com";
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
    email: "jessica@nextchaptertravel.com",
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
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    (el as HTMLScriptElement).type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
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
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Standard meta
    setMeta("description", description);
    setMeta("robots", "index, follow");

    // Open Graph
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:type", ogType, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:site_name", SITE_NAME, true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    // Canonical link
    setLinkRel("canonical", canonicalUrl);

    // JSON-LD
    if (includeLocalBusiness) {
      injectJsonLd("json-ld-local-business", LOCAL_BUSINESS_SCHEMA);
    } else {
      removeJsonLd("json-ld-local-business");
    }
  }, [fullTitle, description, canonicalUrl, ogImage, ogType, includeLocalBusiness]);

  return null;
}
