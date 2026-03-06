export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
// Falls back gracefully when VITE_OAUTH_PORTAL_URL is not configured so the
// app renders instead of throwing "Failed to construct 'URL': Invalid URL".
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  // Guard: if the OAuth portal URL is not configured (e.g. env var not set in
  // Netlify), return a safe no-op href so the app still renders correctly.
  if (!oauthPortalUrl || oauthPortalUrl === "undefined") {
    return "#";
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
