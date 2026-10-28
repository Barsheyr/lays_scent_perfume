// The shop's public address, without needing a NEXT_PUBLIC_ variable.
// Order: SITE_URL env var -> the address the request came in on ->
// Vercel's production domain (system env var) -> browser address.
export function siteUrl(request) {
  const fromEnv = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  if (request?.url) return new URL(request.url).origin;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
