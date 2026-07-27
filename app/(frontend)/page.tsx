import { HomePage } from "./home-page";
import { getGlobalSchemaOrg, getGlobalSeo, getHomeCmsContent } from "@/lib/cms-content";

export async function generateMetadata() {
  return {
    title: "Цифровые системы для бизнеса",
    description:
      "Автоматизируем бизнес-процессы и создаём цифровые продукты: от исследования задачи до запуска и развития.",
    ...(await getGlobalSeo("home-page")),
  };
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, schema] = await Promise.all([getHomeCmsContent(), getGlobalSchemaOrg("home-page")]);
  return <><HomePage content={content ?? undefined} />{schema.map((item, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />)}</>;
}
