import type { Field } from "payload";

const technicalNames = new Set([
  "slug", "url", "buttonUrl", "primaryUrl", "secondaryUrl", "price", "number",
  "phone", "email", "telegram", "submitLabel", "successLabel", "telegramLabel",
  "buttonLabel", "primaryLabel", "secondaryLabel", "systemsLine", "tagline",
  "id", "type", "version", "format", "style", "mode", "detail", "direction", "tag",
  "createdAt", "updatedAt", "focusKeyword", "keywords", "canonicalUrl", "robots",
  "ogTitle", "ogDescription", "ogUrl", "ogType", "twitterTitle", "twitterDescription",
  "schemaOrg", "primaryHeadingTag", "globalType", "blockType",
]);

export function textToLexical(text: string, heading = false) {
  return {
    root: {
      type: "root", format: "", indent: 0, version: 1, direction: "ltr" as const,
      children: [{
        type: heading ? "heading" : "paragraph",
        ...(heading ? { tag: "h2" } : {}),
        format: "", indent: 0, version: 1, direction: "ltr" as const,
        children: [{ type: "text", text, format: 0, style: "", mode: "normal", detail: 0, version: 1 }],
      }],
    },
  };
}

export function addRichTextEditors(fields: Field[]): Field[] {
  const result: Field[] = [];
  const existingNames = new Set(fields.flatMap((field) => "name" in field ? [field.name] : []));
  for (const source of fields) {
    const field = "fields" in source && Array.isArray(source.fields)
      ? { ...source, fields: addRichTextEditors(source.fields) } as Field
      : source;
    if (!("name" in field) || !("type" in field) || (field.type !== "text" && field.type !== "textarea") || technicalNames.has(field.name) || field.name.endsWith("RichText") || existingNames.has(`${field.name}RichText`)) {
      result.push(field);
      continue;
    }
    result.push(
      { ...field, admin: { ...field.admin, hidden: true }, required: false } as Field,
      {
        name: `${field.name}RichText`,
        type: "richText",
        label: `${typeof field.label === "string" ? field.label : field.name} — редактор`,
        admin: { description: "H1–H6, абзацы, ссылки, жирный, курсив и списки." },
      } as Field,
    );
  }
  return result;
}

export function populateRichTextEditors(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(populateRichTextEditors);
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  for (const [key, item] of Object.entries(record)) {
    if (key.endsWith("RichText")) continue;
    if (item && typeof item === "object") populateRichTextEditors(item);
    if (typeof item !== "string" || technicalNames.has(key) || key.endsWith("RichText")) continue;
    const richKey = `${key}RichText`;
    if (!record[richKey]) record[richKey] = textToLexical(item, key === "title" || key === "question");
  }
  return record;
}

function lexicalPlainText(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  if (typeof record.text === "string") return record.text;
  return Array.isArray(record.children) ? record.children.map(lexicalPlainText).filter(Boolean).join(" ") : "";
}

export function syncLegacyFromRichText(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(syncLegacyFromRichText);
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  for (const [key, item] of Object.entries(record)) {
    if (key.endsWith("RichText")) {
      if (!item) continue;
      const legacyKey = key.slice(0, -"RichText".length);
      record[legacyKey] = lexicalPlainText((item as { root?: unknown }).root).trim();
      continue;
    }
    if (item && typeof item === "object") syncLegacyFromRichText(item);
  }
  return record;
}
