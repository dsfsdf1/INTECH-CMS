import type { Field } from "payload";

export const publishFields: Field[] = [
  {
    name: "visible",
    type: "checkbox",
    label: "Показывать на сайте",
    defaultValue: true,
    admin: { position: "sidebar" },
  },
  {
    name: "order",
    type: "number",
    label: "Порядок",
    defaultValue: 0,
    admin: { position: "sidebar", step: 1 },
  },
];

export const linkFields: Field[] = [
  {
    name: "buttonLabel",
    type: "text",
    label: "Текст кнопки",
  },
  {
    name: "buttonUrl",
    type: "text",
    label: "Ссылка кнопки",
  },
];

export const seoFields: Field = {
  name: "seo",
  type: "group",
  label: "SEO",
  fields: [
    { name: "title", type: "text", label: "Meta title", maxLength: 70 },
    {
      name: "description",
      type: "textarea",
      label: "Meta description",
      maxLength: 180,
    },
    {
      name: "image",
      type: "relationship",
      relationTo: "media",
      label: "Изображение для соцсетей",
    },
    {
      name: "noIndex",
      type: "checkbox",
      label: "Запретить индексацию",
      defaultValue: false,
    },
  ],
};

export const pageSeoAdvancedFields: Field = {
  name: "seoAdvanced",
  type: "group",
  label: "Расширенные SEO-настройки",
  fields: [
    { name: "focusKeyword", type: "text", label: "Фокусный ключевой запрос", admin: { description: "Основной поисковый запрос для этой страницы" } },
    {
      name: "primaryHeadingTag",
      type: "select",
      label: "Тег главного заголовка страницы",
      defaultValue: "h1",
      options: [
        { label: "H1 — основной заголовок (рекомендуется)", value: "h1" },
        { label: "H2", value: "h2" },
        { label: "H3", value: "h3" },
        { label: "Обычный текст (p)", value: "p" },
        { label: "Технический контейнер (div)", value: "div" },
      ],
      admin: { description: "По умолчанию H1. На странице должен быть только один H1." },
    },
    { name: "keywords", type: "text", label: "Ключевые слова", admin: { description: "Через запятую" } },
    { name: "canonicalUrl", type: "text", label: "Canonical URL" },
    { name: "robots", type: "text", label: "Robots", defaultValue: "index,follow", admin: { description: "Например: index,follow или noindex,nofollow" } },
    { name: "ogTitle", type: "text", label: "Open Graph title" },
    { name: "ogDescription", type: "textarea", label: "Open Graph description" },
    { name: "ogUrl", type: "text", label: "Open Graph URL" },
    { name: "ogType", type: "text", label: "Open Graph type", defaultValue: "website" },
    { name: "twitterTitle", type: "text", label: "Twitter / X title" },
    { name: "twitterDescription", type: "textarea", label: "Twitter / X description" },
    {
      name: "schemaOrg",
      type: "textarea",
      label: "Schema.org / JSON-LD",
      admin: { description: "JSON или массив JSON-объектов. Например: Organization, WebSite, Service, FAQPage или LocalBusiness." },
    },
  ],
};
