import type { Field, GlobalConfig } from "payload";
import { authenticated, publicRead } from "../access";

const collapsibleSections = (fields: unknown[]): Field[] =>
  fields.map((field) => ({
    type: "collapsible",
    label: (field as { label?: string }).label ?? "Раздел",
    admin: { initCollapsed: true },
    fields: [field as Field],
  }));

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Настройки сайта",
  admin: { group: "Сайт" },
  access: { read: publicRead, update: authenticated },
  fields: collapsibleSections([
    {
      name: "contacts",
      type: "group",
      label: "Контакты",
      admin: { initCollapsed: true },
      fields: [
        { name: "phone", type: "text", label: "Телефон" },
        { name: "email", type: "email", label: "Email" },
        { name: "telegram", type: "text", label: "Telegram URL" },
        { name: "address", type: "textarea", label: "Адрес" },
      ],
    },
    {
      name: "navigation",
      type: "array",
      label: "Навигация",
      admin: { initCollapsed: true },
      fields: [
        { name: "label", type: "text", label: "Подпись", required: true },
        { name: "url", type: "text", label: "Ссылка", required: true },
        { name: "visible", type: "checkbox", label: "Показывать", defaultValue: true },
      ],
    },
    {
      name: "colors",
      type: "group",
      label: "Цветовые токены",
      admin: { initCollapsed: true },
      fields: [
        {
          name: "accent",
          type: "select",
          label: "Акцент",
          defaultValue: "blue",
          options: [
            { label: "Фирменный синий", value: "blue" },
            { label: "Графитовый", value: "graphite" },
            { label: "Монохромный", value: "mono" },
          ],
        },
        {
          name: "surface",
          type: "select",
          label: "Основная поверхность",
          defaultValue: "white",
          options: [
            { label: "Белая", value: "white" },
            { label: "Холодно-серая", value: "cool-gray" },
          ],
        },
      ],
    },
    {
      name: "seoCenter",
      type: "group",
      label: "SEO-центр",
      fields: [
        { name: "siteUrl", type: "text", label: "Основной адрес сайта", admin: { description: "Например: https://intech.ru" } },
        { name: "siteName", type: "text", label: "Название бренда", defaultValue: "ИНТЕХ" },
        { name: "organizationType", type: "text", label: "Schema.org тип компании", defaultValue: "Organization", admin: { description: "Organization, LocalBusiness или ProfessionalService" } },
        { name: "organizationName", type: "text", label: "Юридическое/полное название" },
        { name: "socialLinks", type: "textarea", label: "Ссылки на соцсети", admin: { description: "По одной ссылке с новой строки" } },
        { name: "robotsText", type: "textarea", label: "Дополнительные правила robots.txt", admin: { description: "Ваши строки будут добавлены к стандартным правилам" } },
        {
          name: "analytics",
          type: "group",
          label: "Аналитика и пиксели",
          admin: { description: "После сохранения счётчики автоматически появятся на публичных страницах сайта." },
          fields: [
            { name: "yandexMetrikaId", type: "text", label: "Яндекс Метрика: ID счётчика", admin: { description: "Только цифры, например 12345678" } },
            { name: "googleAnalyticsId", type: "text", label: "Google Analytics 4: Measurement ID", admin: { description: "Например G-XXXXXXXXXX" } },
            { name: "metaPixelId", type: "text", label: "Meta Pixel ID", admin: { description: "Только ID пикселя" } },
          ],
        },
      ],
    },
  ]),
};
