import { headers } from "next/headers";

/**
 * Resolves the active base URL from incoming request headers or fallback env/default.
 * Ensures sitemaps and robots.txt always match the requested domain and protocol.
 */
export function getRequestBaseUrl(): string {
  try {
    const headersList = headers();
    const rawHost = headersList.get("x-forwarded-host") || headersList.get("host");
    const host = rawHost?.split(",")[0].trim();
    if (host) {
      const rawProto =
        headersList.get("x-forwarded-proto") ||
        (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
      const proto = rawProto.split(",")[0].trim();
      return `${proto}://${host}`;
    }
  } catch {
    // Fallback when called outside an active request context
  }

  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://aacharya-tutor.vercel.app"
  );
}
