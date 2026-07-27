import { AutomationPage } from "./automation-page";
import { automationVisuals } from "./data";
import { getAutomationCmsContent, getGlobalSchemaOrg, getGlobalSeo } from "@/lib/cms-content";

export async function generateMetadata() {
  return {
    title: "Автоматизация бизнеса",
    description:
      "Автоматизируем бизнес-процессы и создаём цифровые системы: от аудита задачи до внедрения и развития.",
    ...(await getGlobalSeo("automation-page")),
  };
}

export const dynamic = "force-dynamic";

export default async function Automation() {
  const [content, schema] = await Promise.all([getAutomationCmsContent(automationVisuals), getGlobalSchemaOrg("automation-page")]);
  return <><AutomationPage content={content ?? undefined} />{schema.map((item, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />)}</>;
}
