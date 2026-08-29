import type { MetadataRoute } from "next";

const siteUrl = "https://talkcars.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      // hreflang alternates for multi-language sitemap
      alternates: {
        languages: {
          en: siteUrl,
          fr: `${siteUrl}/fr`,
          ar: `${siteUrl}/ar`,
          tr: `${siteUrl}/tr`,
        },
      },
    },
    {
      url: `${siteUrl}/chat`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
