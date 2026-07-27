import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { getSeoCenter, getSiteTokens } from "@/lib/cms-content";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const seo = await getSeoCenter();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const origin = host ? `${protocol}://${host}` : "http://localhost:3000";
  const socialImage = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "ИНТЕХ — цифровые системы для бизнеса",
      template: `%s — ${seo.siteName}`,
    },
    description: "Автоматизируем бизнес-процессы и создаём цифровые продукты полного цикла.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: origin,
      siteName: "ИНТЕХ",
      title: "ИНТЕХ — цифровые системы для бизнеса",
      description:
        "Автоматизируем бизнес-процессы и создаём цифровые продукты полного цикла.",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "ИНТЕХ — цифровые системы для бизнеса",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "ИНТЕХ — цифровые системы для бизнеса",
      description:
        "Автоматизируем бизнес-процессы и создаём цифровые продукты полного цикла.",
      images: [socialImage],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [tokens, seo] = await Promise.all([getSiteTokens(), getSeoCenter()]);
  const analytics = seo.analytics;
  const organization = {
    "@context": "https://schema.org",
    "@type": seo.organizationType,
    name: seo.organizationName || seo.siteName,
    url: seo.siteUrl,
    ...(seo.phone ? { telephone: seo.phone } : {}),
    ...(seo.email ? { email: seo.email } : {}),
    ...(seo.address ? { address: { "@type": "PostalAddress", streetAddress: seo.address } } : {}),
    ...(seo.socialLinks.length ? { sameAs: seo.socialLinks } : {}),
  };
  return (
    <html lang="ru">
      <body data-accent={tokens.accent} data-surface={tokens.surface}>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        {analytics.yandexMetrikaId && <Script id="yandex-metrika" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");window.__intechMetrikaId=${JSON.stringify(Number(analytics.yandexMetrikaId))};ym(window.__intechMetrikaId,"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});` }} />}
        {analytics.googleAnalyticsId && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analytics.googleAnalyticsId)}`} strategy="afterInteractive" /><Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag("js",new Date());gtag("config",${JSON.stringify(analytics.googleAnalyticsId)});` }} /></>}
        {analytics.metaPixelId && <Script id="meta-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init",${JSON.stringify(analytics.metaPixelId)});fbq("track","PageView");` }} />}
      </body>
    </html>
  );
}
