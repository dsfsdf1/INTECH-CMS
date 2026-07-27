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

export const AutomationPage: GlobalConfig = {
  slug: "automation-page",
  label: "Автоматизация",
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
        { name: "text", type: "textarea", label: "Описание (архив)", admin: { hidden: true } },
        { name: "textRichText", type: "richText", label: "Описание — редактор", admin: { description: "Если заполнен, используется на сайте вместо старого описания." } },
        { name: "media", type: "relationship", relationTo: "media", label: "Фоновое медиа" },
        {
          name: "primaryLabel",
          type: "text",
          label: "Главная кнопка",
          defaultValue: "Разобрать мой процесс",
        },
        {
          name: "primaryUrl",
          type: "text",
          label: "Ссылка главной кнопки",
          defaultValue: "#contact",
        },
        {
          name: "secondaryLabel",
          type: "text",
          label: "Вторая кнопка",
          defaultValue: "Посмотреть кейсы",
        },
        {
          name: "secondaryUrl",
          type: "text",
          label: "Ссылка второй кнопки",
          defaultValue: "#cases",
        },
        {
          name: "systemsLine",
          type: "text",
          label: "Строка систем",
          defaultValue: "CRM · 1С · iiko · Telegram · API · BI · AI-агенты",
        },
      ],
    },
    {
      name: "sectionHeadings",
      type: "group",
      label: "Заголовки разделов",
      admin: { initCollapsed: true },
      fields: [
        { name: "problems", type: "text", label: "Проблемы" },
        { name: "directions", type: "text", label: "Направления" },
        { name: "cases", type: "text", label: "Кейсы" },
        { name: "facts", type: "text", label: "Фактоиды" },
        { name: "stages", type: "text", label: "Этапы" },
        { name: "reviews", type: "text", label: "Отзывы" },
        { name: "contact", type: "text", label: "Контактный блок" },
      ],
    },
    {
      name: "problems",
      type: "array",
      label: "Проблемные сценарии",
      admin: { description: "Карточки блока «Узнаёте один из этих сценариев?»", initCollapsed: true },
      fields: [
        { name: "title", type: "text", label: "Проблема", required: true },
        { name: "before", type: "textarea", label: "До", required: true },
        { name: "after", type: "textarea", label: "После", required: true },
        { name: "visible", type: "checkbox", label: "Показывать", defaultValue: true },
      ],
    },
    {
      name: "flow",
      type: "group",
      label: "Схема процесса",
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", label: "Заголовок" },
        { name: "text", type: "textarea", label: "Описание" },
        {
          name: "items",
          type: "array",
          label: "Шаги",
          fields: [
            { name: "text", type: "text", label: "Название", required: true },
            { name: "visible", type: "checkbox", label: "Показывать", defaultValue: true },
          ],
        },
      ],
    },
    {
      name: "directionsIntro",
      type: "group",
      label: "Вступление к направлениям",
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", label: "Заголовок" },
        { name: "text", type: "textarea", label: "Описание" },
      ],
    },
    {
      name: "casesIntro",
      type: "group",
      label: "Вступление к кейсам",
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", label: "Заголовок" },
        { name: "text", type: "textarea", label: "Описание" },
      ],
    },
    {
      name: "factsIntro",
      type: "group",
      label: "Вступление к фактоидам",
      admin: { initCollapsed: true },
      fields: [{ name: "title", type: "text", label: "Заголовок" }],
    },
    {
      name: "integrations",
      type: "group",
      label: "Интеграции",
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", label: "Заголовок" },
        { name: "text", type: "textarea", label: "Описание" },
        {
          name: "systems",
          type: "array",
          label: "Системы",
          fields: [
            { name: "name", type: "text", label: "Название", required: true },
            { name: "visible", type: "checkbox", label: "Показывать", defaultValue: true },
          ],
        },
      ],
    },
    {
      name: "stagesIntro",
      type: "group",
      label: "Вступление к этапам",
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", label: "Заголовок" },
        { name: "text", type: "textarea", label: "Описание" },
      ],
    },
    {
      name: "formats",
      type: "group",
      label: "Форматы работы",
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", label: "Заголовок" },
        { name: "text", type: "textarea", label: "Описание" },
        {
          name: "items",
          type: "array",
          label: "Карточки",
          fields: [
            { name: "title", type: "text", label: "Заголовок", required: true },
            { name: "text", type: "textarea", label: "Описание", required: true },
            { name: "media", type: "relationship", relationTo: "media", label: "Медиа" },
            { name: "visible", type: "checkbox", label: "Показывать", defaultValue: true },
          ],
        },
      ],
    },
    {
      name: "pricing",
      type: "group",
      label: "Стоимость",
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", label: "Заголовок" },
        { name: "subtitle", type: "text", label: "Подзаголовок" },
        { name: "footerText", type: "textarea", label: "Текст под карточками" },
        { name: "buttonLabel", type: "text", label: "Кнопка" },
        { name: "buttonUrl", type: "text", label: "Ссылка кнопки" },
      ],
    },
    {
      name: "reviewsIntro",
      type: "group",
      label: "Вступление к отзывам",
      admin: { initCollapsed: true },
      fields: [{ name: "title", type: "text", label: "Заголовок" }],
    },
    {
      name: "faq",
      type: "group",
      label: "Частые вопросы",
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", label: "Заголовок" },
        {
          name: "items",
          type: "array",
          label: "Вопросы",
          fields: [
            { name: "question", type: "text", label: "Вопрос", required: true },
            { name: "answer", type: "textarea", label: "Ответ", required: true },
            { name: "visible", type: "checkbox", label: "Показывать", defaultValue: true },
          ],
        },
      ],
    },
    {
      name: "contact",
      type: "group",
      label: "Контактный блок",
      admin: { initCollapsed: true },
      fields: [
        { name: "title", type: "text", label: "Заголовок" },
        { name: "accent", type: "text", label: "Акцентная часть заголовка" },
        { name: "text", type: "textarea", label: "Описание" },
        { name: "note", type: "textarea", label: "Примечание под формой" },
        { name: "submitLabel", type: "text", label: "Кнопка формы" },
        { name: "successLabel", type: "text", label: "Текст после отправки" },
        { name: "telegramLabel", type: "text", label: "Кнопка Telegram" },
      ],
    },
    {
      name: "footer",
      type: "group",
      label: "Подвал страницы",
      admin: { initCollapsed: true },
      fields: [{ name: "tagline", type: "text", label: "Подпись" }],
    },
    seoFields,
    pageSeoAdvancedFields,
  ] as Field[])),
};
