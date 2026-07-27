import type { CollectionConfig, Field } from "payload";
import { authenticated, publicContentRead } from "../access";
import { linkFields, publishFields, seoFields } from "../fields";
import { addRichTextEditors, populateRichTextEditors, syncLegacyFromRichText } from "../richTextMigration";

type ContentCollectionOptions = {
  slug: string;
  singular: string;
  plural: string;
  fields?: Field[];
  seo?: boolean;
};

function contentCollection({
  slug,
  singular,
  plural,
  fields = [],
  seo = false,
}: ContentCollectionOptions): CollectionConfig {
  return {
    slug,
    labels: { singular, plural },
    admin: {
      group: "Карточки",
      useAsTitle: "title",
      defaultColumns: ["title", "visible", "order", "updatedAt"],
    },
    access: {
      create: authenticated,
      read: publicContentRead,
      update: authenticated,
      delete: authenticated,
    },
    hooks: {
      afterRead: [({ doc }) => populateRichTextEditors(doc) as typeof doc],
      beforeValidate: [({ data }) => syncLegacyFromRichText(data) as typeof data],
    },
    defaultSort: "order",
    fields: addRichTextEditors([
      { name: "title", type: "text", label: "Заголовок", required: true },
      {
        name: "text",
        type: "textarea",
        label: "Описание",
      },
      {
        name: "media",
        type: "relationship",
        relationTo: "media",
        label: "Изображение или видео",
      },
      ...fields,
      ...publishFields,
      ...(seo ? [seoFields] : []),
    ] as Field[]),
  };
}

export const Facts = contentCollection({
  slug: "facts",
  singular: "Фактоид",
  plural: "Фактоиды",
  fields: [{ name: "value", type: "text", label: "Ключевое значение" }],
});

export const Directions = contentCollection({
  slug: "directions",
  singular: "Направление",
  plural: "Направления",
  seo: true,
  fields: [
    { name: "number", type: "text", label: "Номер" },
    { name: "eyebrow", type: "text", label: "Надзаголовок" },
    { name: "slug", type: "text", label: "URL slug", required: true, unique: true },
    { name: "outcomes", type: "array", label: "Результаты", admin: { initCollapsed: true }, fields: [{ name: "text", type: "text", required: true }] },
    {
      name: "sections",
      type: "array",
      label: "Разделы материала",
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", label: "Заголовок", required: true },
        { name: "text", type: "textarea", label: "Текст", required: true },
        { name: "points", type: "array", label: "Пункты", fields: [{ name: "text", type: "text", required: true }] },
      ],
    },
    ...linkFields,
  ],
});

export const Stages = contentCollection({
  slug: "stages",
  singular: "Этап работы",
  plural: "Этапы работы",
});

export const Reviews = contentCollection({
  slug: "reviews",
  singular: "Отзыв",
  plural: "Отзывы",
  fields: [
    { name: "author", type: "text", label: "Автор", required: true },
    { name: "company", type: "text", label: "Компания" },
    { name: "role", type: "text", label: "Должность" },
  ],
});

export const Cases = contentCollection({
  slug: "cases",
  singular: "Кейс",
  plural: "Кейсы",
  seo: true,
  fields: [
    { name: "slug", type: "text", label: "URL slug", required: true, unique: true },
    { name: "client", type: "text", label: "Клиент" },
    { name: "metrics", type: "array", label: "Метрики", admin: { initCollapsed: true }, fields: [
      { name: "value", type: "text", label: "Значение", required: true },
      { name: "label", type: "text", label: "Пояснение", required: true },
    ] },
    ...linkFields,
  ],
});

export const Products = contentCollection({
  slug: "products",
  singular: "Продукт",
  plural: "Продукты",
  seo: true,
  fields: [
    { name: "slug", type: "text", label: "URL slug", required: true, unique: true },
    { name: "price", type: "text", label: "Стоимость" },
    { name: "features", type: "array", label: "Состав", admin: { initCollapsed: true }, fields: [{ name: "text", type: "text", required: true }] },
    ...linkFields,
  ],
});
