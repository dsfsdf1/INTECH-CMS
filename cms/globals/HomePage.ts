import type { Field, GlobalConfig } from "payload";
import { authenticated, publicRead } from "../access";
import { pageSeoAdvancedFields, seoFields } from "../fields";
import { addRichTextEditors, populateRichTextEditors, syncLegacyFromRichText } from "../richTextMigration";

const collapsibleSections = (fields: unknown[]): Field[] =>
  fields.map((field) => ({
    type: "collapsible",
    label: (field as { label?: string }).label ?? "Раздел",
    admin: { initCollapsed: true },
    fields: [field as Field],
  }));

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Главная страница",
  admin: { group: "Страницы" },
  access: { read: publicRead, update: authenticated },
  hooks: { afterRead: [({ doc }) => populateRichTextEditors(doc) as typeof doc], beforeValidate: [({ data }) => syncLegacyFromRichText(data) as typeof data] },
  fields: collapsibleSections(addRichTextEditors([
    {
      name: "hero",
      type: "group",
      label: "Первый экран",
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "textarea", label: "Заголовок (архив)", admin: { hidden: true } },
        { name: "titleRichText", type: "richText", label: "Заголовок — редактор", admin: { description: "H1–H6, жирный, курсив, ссылки и списки. Если заполнен, используется на сайте вместо старого заголовка." } },
        { name: "accent", type: "text", label: "Акцентная строка" },
        { name: "message", type: "textarea", label: "Текст поверх видео (архив)", admin: { hidden: true } },
        { name: "messageRichText", type: "richText", label: "Текст поверх видео — редактор", admin: { description: "Если заполнен, используется на сайте вместо старого текста." } },
        { name: "video", type: "relationship", relationTo: "media", label: "Видео" },
      ],
    },
    {
      name: "statement",
      type: "group",
      label: "Основной тезис",
      admin: { initCollapsed: true },
      fields: [
        { name: "eyebrow", type: "text", label: "Подпись" },
        { name: "title", type: "textarea", label: "Текст" },
      ],
    },
    {
      name: "contact",
      type: "group",
      label: "Финальный призыв",
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "textarea", label: "Заголовок" },
        { name: "text", type: "textarea", label: "Описание" },
        { name: "buttonLabel", type: "text", label: "Текст кнопки" },
        { name: "buttonUrl", type: "text", label: "Ссылка кнопки" },
      ],
    },
    seoFields,
    pageSeoAdvancedFields,
  ] as Field[])),
};
