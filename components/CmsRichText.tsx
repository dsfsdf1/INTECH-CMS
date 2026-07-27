"use client";

import { RichText } from "@payloadcms/richtext-lexical/react";

export type CmsRichTextValue = { root?: { children?: unknown[] } } | null | undefined;

export function hasCmsRichText(value: CmsRichTextValue) {
  return Boolean(value?.root?.children?.some((node) => {
    const content = node as { text?: unknown; children?: unknown };
    const text = content.text;
    const children = content.children;
    return (typeof text === "string" && text.trim()) || (Array.isArray(children) && children.length);
  }));
}

export function CmsRichText({ value, className }: { value: CmsRichTextValue; className?: string }) {
  if (!hasCmsRichText(value)) return null;
  return <RichText data={value as never} className={className} />;
}
