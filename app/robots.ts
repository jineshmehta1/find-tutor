import type { MetadataRoute } from "next";
import { getRequestBaseUrl } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getRequestBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/student/", "/teacher/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
