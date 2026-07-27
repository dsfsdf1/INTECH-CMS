import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAutomationArticle } from "../../../automation/data";
import { getAutomationSource } from "../../../automation/article-source";
import { MarkdownArticle } from "../../../automation/markdown-article";
import { SiteNavigation } from "../../../site-navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getAutomationArticle(slug);
  if (!article) return { title: "Материал" };
  return { title: article.title, description: article.excerpt };
}

export default async function AutomationArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getAutomationArticle(slug);
  const source = getAutomationSource(slug);
  if (!article || !source) notFound();

  return (
    <main className="automation-article-page">
      <SiteNavigation active="articles" />
      <article className="article-source"><MarkdownArticle source={source} /></article>
    </main>
  );
}
