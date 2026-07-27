import "server-only";
import config from "@payload-config";
import { getPayload } from "payload";
import type { AutomationArticle } from "@/app/(frontend)/automation/data";
import type { Metadata } from "next";
import type { CmsRichTextValue } from "@/components/CmsRichText";

type MediaValue =
  | number
  | string
  | {
      url?: string | null;
      alt?: string | null;
      sizes?: { card?: { url?: string | null } | null } | null;
    }
  | null
  | undefined;

type SeoValue = {
  title?: string | null; description?: string | null; image?: MediaValue; noIndex?: boolean | null;
  seoAdvanced?: { focusKeyword?: string | null; primaryHeadingTag?: string | null; keywords?: string | null; canonicalUrl?: string | null; robots?: string | null; ogTitle?: string | null; ogDescription?: string | null; ogUrl?: string | null; ogType?: string | null; twitterTitle?: string | null; twitterDescription?: string | null; schemaOrg?: string | null } | null;
};

function mediaUrl(media: MediaValue, fallback: string) {
  if (!media || typeof media === "number" || typeof media === "string") {
    return fallback;
  }
  return media.sizes?.card?.url ?? media.url ?? fallback;
}

export async function getGlobalSchemaOrg(slug: "home-page" | "automation-page"): Promise<object[]> {
  try {
    const payload = await getPayload({ config });
    const page = await payload.findGlobal({ slug, depth: 0 });
    const source = (page as { seoAdvanced?: SeoValue["seoAdvanced"] }).seoAdvanced?.schemaOrg;
    if (!source) return [];
    const parsed: unknown = JSON.parse(source);
    return Array.isArray(parsed) ? parsed.filter((item): item is object => Boolean(item) && typeof item === "object") : typeof parsed === "object" && parsed ? [parsed] : [];
  } catch (error) {
    console.warn(`Payload Schema.org for ${slug} is unavailable or invalid.`, error);
    return [];
  }
}

export async function getGlobalSeo(slug: "home-page" | "automation-page"): Promise<Metadata> {
  try {
    const payload = await getPayload({ config });
    const page = await payload.findGlobal({ slug, depth: 1 });
    const seo = (page as { seo?: SeoValue }).seo;
    if (!seo) return {};
    const advanced = (page as { seoAdvanced?: SeoValue["seoAdvanced"] }).seoAdvanced;
    const image = mediaUrl(seo.image, "");
    return {
      ...(seo.title ? { title: seo.title } : {}),
      ...(seo.description ? { description: seo.description } : {}),
      ...(advanced?.keywords ? { keywords: advanced.keywords.split(",").map((item) => item.trim()).filter(Boolean) } : {}),
      ...(advanced?.canonicalUrl ? { alternates: { canonical: advanced.canonicalUrl } } : {}),
      ...(seo.noIndex || advanced?.robots ? { robots: seo.noIndex ? "noindex,nofollow" : advanced?.robots ?? "index,follow" } : {}),
      openGraph: { type: advanced?.ogType === "article" ? "article" : "website", ...(advanced?.ogTitle || seo.title ? { title: advanced?.ogTitle ?? seo.title! } : {}), ...(advanced?.ogDescription || seo.description ? { description: advanced?.ogDescription ?? seo.description! } : {}), ...(advanced?.ogUrl ? { url: advanced.ogUrl } : {}), ...(image ? { images: [image] } : {}) },
      twitter: { card: "summary_large_image", ...(advanced?.twitterTitle || seo.title ? { title: advanced?.twitterTitle ?? seo.title! } : {}), ...(advanced?.twitterDescription || seo.description ? { description: advanced?.twitterDescription ?? seo.description! } : {}), ...(image ? { images: [image] } : {}) },
    };
  } catch (error) {
    console.warn(`Payload SEO for ${slug} is unavailable; using defaults.`, error);
    return {};
  }
}

export type AutomationCmsContent = {
  primaryHeadingTag?: "h1" | "h2" | "h3" | "p" | "div";
  hero?: {
    title?: string | null;
    text?: string | null;
    image?: string;
    primaryLabel?: string | null;
    primaryUrl?: string | null;
    secondaryLabel?: string | null;
    secondaryUrl?: string | null;
    systemsLine?: string | null;
    titleRichText?: CmsRichTextValue;
    textRichText?: CmsRichTextValue;
  };
  headings?: Record<string, string | null | undefined>;
  problems?: Array<[string, string, string]>;
  flow?: {
    title?: string | null;
    text?: string | null;
    items?: string[];
  };
  directionsIntro?: { title?: string | null; text?: string | null };
  casesIntro?: { title?: string | null; text?: string | null };
  factsIntro?: { title?: string | null };
  integrations?: {
    title?: string | null;
    text?: string | null;
    systems?: string[];
  };
  stagesIntro?: { title?: string | null; text?: string | null };
  formats?: {
    title?: string | null;
    text?: string | null;
    items?: Array<{ title: string; text: string; image: string }>;
  };
  pricing?: {
    title?: string | null;
    subtitle?: string | null;
    footerText?: string | null;
    buttonLabel?: string | null;
    buttonUrl?: string | null;
  };
  products?: Array<{ title: string; text: string; price: string }>;
  reviewsIntro?: { title?: string | null };
  faq?: {
    title?: string | null;
    items?: Array<[string, string]>;
  };
  contact?: {
    title?: string | null;
    accent?: string | null;
    text?: string | null;
    note?: string | null;
    submitLabel?: string | null;
    successLabel?: string | null;
    telegramLabel?: string | null;
  };
  footer?: { tagline?: string | null };
  directions?: AutomationArticle[];
  cases?: Array<{ name: string; title: string; text: string; image: string; url?: string }>;
  facts?: Array<[string, string]>;
  stages?: Array<[string, string]>;
  reviews?: Array<[string, string]>;
};

export type HomeCmsContent = {
  primaryHeadingTag?: "h1" | "h2" | "h3" | "p" | "div";
  hero?: {
    accent?: string | null;
    video?: string;
    titleRichText?: CmsRichTextValue;
    messageRichText?: CmsRichTextValue;
  };
  statement?: {
    eyebrow?: string | null;
    title?: string | null;
  };
  contact?: {
    title?: string | null;
    text?: string | null;
    buttonLabel?: string | null;
    buttonUrl?: string | null;
  };
};

export async function getHomeCmsContent(): Promise<HomeCmsContent | null> {
  try {
    const payload = await getPayload({ config });
    const page = await payload.findGlobal({ slug: "home-page", depth: 1 });

    return {
      primaryHeadingTag: ["h1", "h2", "h3", "p", "div"].includes(page.seoAdvanced?.primaryHeadingTag ?? "") ? page.seoAdvanced?.primaryHeadingTag as HomeCmsContent["primaryHeadingTag"] : "h1",
      hero: page.hero
        ? {
            titleRichText: page.hero.titleRichText,
            accent: page.hero.accent,
            messageRichText: page.hero.messageRichText,
            video: mediaUrl(page.hero.video, ""),
          }
        : undefined,
      statement: page.statement ?? undefined,
      contact: page.contact ?? undefined,
    };
  } catch (error) {
    console.warn("Payload home content is unavailable; using bundled fallback.", error);
    return null;
  }
}

export async function getAutomationCmsContent(
  fallbackImages: Record<string, string>,
): Promise<AutomationCmsContent | null> {
  try {
    const payload = await getPayload({ config });
    const [page, directions, cases, facts, stages, reviews, products] = await Promise.all([
      payload.findGlobal({ slug: "automation-page", depth: 1 }),
      payload.find({
        collection: "directions",
        depth: 1,
        limit: 100,
        sort: "order",
        where: { visible: { equals: true } },
      }),
      payload.find({
        collection: "cases",
        depth: 1,
        limit: 100,
        sort: "order",
        where: { visible: { equals: true } },
      }),
      payload.find({
        collection: "facts",
        depth: 1,
        limit: 100,
        sort: "order",
        where: { visible: { equals: true } },
      }),
      payload.find({
        collection: "stages",
        depth: 1,
        limit: 100,
        sort: "order",
        where: { visible: { equals: true } },
      }),
      payload.find({
        collection: "reviews",
        depth: 1,
        limit: 100,
        sort: "order",
        where: { visible: { equals: true } },
      }),
      payload.find({
        collection: "products",
        depth: 1,
        limit: 100,
        sort: "order",
        where: { visible: { equals: true } },
      }),
    ]);

    const directionFallbackImages: Record<string, string> = {
      "business-process-automation": fallbackImages.process,
      "request-automation-system": fallbackImages.requests,
      "sales-automation": fallbackImages.sales,
      "document-workflow-automation": fallbackImages.documents,
      "reporting-automation": fallbackImages.reports,
      "ai-implementation": fallbackImages.ai,
      "information-systems-implementation": fallbackImages.systems,
    };

    const normalizedDirections: AutomationArticle[] = directions.docs.map(
      (item, index) => ({
        id: String(item.id),
        number: item.number || String(index + 1).padStart(2, "0"),
        slug: item.slug,
        title: item.title ?? "",
        eyebrow: item.eyebrow || "",
        excerpt: item.text || "",
        image: mediaUrl(
          item.media,
          directionFallbackImages[item.slug] ?? fallbackImages.systems,
        ),
        imageAlt:
          typeof item.media === "object" && item.media?.alt
            ? item.media.alt
            : item.title ?? "",
        outcomes: item.outcomes?.map((entry) => entry.text ?? "") ?? [],
        sections:
          item.sections?.map((section) => ({
            title: section.title ?? "",
            text: section.text ?? "",
            points: section.points?.map((point) => point.text ?? ""),
          })) ?? [],
      }),
    );

    return {
      primaryHeadingTag: ["h1", "h2", "h3", "p", "div"].includes(page.seoAdvanced?.primaryHeadingTag ?? "") ? page.seoAdvanced?.primaryHeadingTag as AutomationCmsContent["primaryHeadingTag"] : "h1",
      hero: page.hero
        ? {
            titleRichText: page.hero.titleRichText,
            textRichText: page.hero.textRichText,
            image: mediaUrl(page.hero.media, fallbackImages.hero),
            primaryLabel: page.hero.primaryLabel,
            primaryUrl: page.hero.primaryUrl,
            secondaryLabel: page.hero.secondaryLabel,
            secondaryUrl: page.hero.secondaryUrl,
            systemsLine: page.hero.systemsLine,
          }
        : undefined,
      headings: page.sectionHeadings as AutomationCmsContent["headings"],
      problems: page.problems?.length
        ? page.problems
            .filter((item) => item.visible !== false)
            .map((item) => [item.title ?? "", item.before ?? "", item.after ?? ""])
        : undefined,
      flow: page.flow
        ? {
            title: page.flow.title,
            text: page.flow.text,
            items: page.flow.items
              ?.filter((item) => item.visible !== false)
              .map((item) => item.text ?? ""),
          }
        : undefined,
      directionsIntro: page.directionsIntro ?? undefined,
      casesIntro: page.casesIntro ?? undefined,
      factsIntro: page.factsIntro ?? undefined,
      integrations: page.integrations
        ? {
            title: page.integrations.title,
            text: page.integrations.text,
            systems: page.integrations.systems
              ?.filter((item) => item.visible !== false)
              .map((item) => item.name ?? ""),
          }
        : undefined,
      stagesIntro: page.stagesIntro ?? undefined,
      formats: page.formats
        ? {
            title: page.formats.title,
            text: page.formats.text,
            items: page.formats.items
              ?.filter((item) => item.visible !== false)
              .map((item, index) => ({
                title: item.title ?? "",
                text: item.text ?? "",
                image: mediaUrl(
                  item.media,
                  [fallbackImages.process, fallbackImages.requests, fallbackImages.sales, fallbackImages.systems][index] ??
                    fallbackImages.systems,
                ),
              })),
          }
        : undefined,
      pricing: page.pricing ?? undefined,
      products: products.docs.length
        ? products.docs.map((item) => ({
            title: item.title ?? "",
            text: item.text || "",
            price: item.price || "",
          }))
        : undefined,
      reviewsIntro: page.reviewsIntro ?? undefined,
      faq: page.faq
        ? {
            title: page.faq.title,
            items: page.faq.items
              ?.filter((item) => item.visible !== false)
              .map((item) => [item.question ?? "", item.answer ?? ""]),
          }
        : undefined,
      contact: page.contact ?? undefined,
      footer: page.footer ?? undefined,
      directions: normalizedDirections.length ? normalizedDirections : undefined,
      cases: cases.docs.length
        ? cases.docs.map((item) => ({
            name: item.client || item.title || "",
            title: item.title ?? "",
            text: item.text || "",
            image: mediaUrl(
              item.media,
              {
                stat: fallbackImages.systems,
                atera: fallbackImages.sales,
                upsello: fallbackImages.requests,
              }[item.slug] ?? fallbackImages.systems,
            ),
            url: item.buttonUrl || undefined,
          }))
        : undefined,
      facts: facts.docs.length
        ? facts.docs.map((item) => [item.value || item.title || "", item.text || ""])
        : undefined,
      stages: stages.docs.length
        ? stages.docs.map((item) => [item.title || "", item.text || ""])
        : undefined,
      reviews: reviews.docs.length
        ? reviews.docs.map((item) => [
            [item.author, item.company].filter(Boolean).join(", "),
            item.text || "",
          ])
        : undefined,
    };
  } catch (error) {
    console.warn("Payload content is unavailable; using bundled fallback.", error);
    return null;
  }
}

export async function getSiteTokens() {
  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({ slug: "site-settings", depth: 0 });
    return {
      accent: settings.colors?.accent ?? "blue",
      surface: settings.colors?.surface ?? "white",
    };
  } catch {
    return { accent: "blue", surface: "white" };
  }
}

export type SeoCenter = {
  siteUrl?: string;
  siteName: string;
  organizationType: string;
  organizationName?: string;
  socialLinks: string[];
  robotsText?: string;
  phone?: string;
  email?: string;
  address?: string;
  analytics: { yandexMetrikaId?: string; googleAnalyticsId?: string; metaPixelId?: string };
};

export async function getSeoCenter(): Promise<SeoCenter> {
  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({ slug: "site-settings", depth: 0 });
    const seo = settings.seoCenter;
    return {
      siteUrl: seo?.siteUrl || undefined,
      siteName: seo?.siteName || "ИНТЕХ",
      organizationType: seo?.organizationType || "Organization",
      organizationName: seo?.organizationName || undefined,
      socialLinks: seo?.socialLinks?.split("\n").map((link) => link.trim()).filter(Boolean) ?? [],
      robotsText: seo?.robotsText || undefined,
      phone: settings.contacts?.phone || undefined,
      email: settings.contacts?.email || undefined,
      address: settings.contacts?.address || undefined,
      analytics: {
        yandexMetrikaId: settings.seoCenter?.analytics?.yandexMetrikaId || undefined,
        googleAnalyticsId: settings.seoCenter?.analytics?.googleAnalyticsId || undefined,
        metaPixelId: settings.seoCenter?.analytics?.metaPixelId || undefined,
      },
    };
  } catch {
    return { siteName: "ИНТЕХ", organizationType: "Organization", socialLinks: [], analytics: {} };
  }
}
