import type { CollectionConfig } from "payload";
import { authenticated } from "../access";

export const Leads: CollectionConfig = {
  slug: "leads",
  labels: { singular: "Заявка", plural: "Заявки" },
  admin: { group: "Продажи", useAsTitle: "name", defaultColumns: ["name", "contact", "status", "source", "utmSource", "createdAt"] },
  access: { create: () => true, read: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: "name", type: "text", label: "Имя / компания", required: true },
    { name: "contact", type: "text", label: "Контакт", required: true },
    { name: "message", type: "textarea", label: "Задача", required: true },
    { name: "source", type: "text", label: "Источник", defaultValue: "Сайт" },
    { name: "status", type: "select", label: "Статус", defaultValue: "new", options: [{ label: "Новая", value: "new" }, { label: "В работе", value: "in_progress" }, { label: "Связались", value: "contacted" }, { label: "Сделка", value: "qualified" }, { label: "Закрыта", value: "closed" }] },
    { name: "assignee", type: "relationship", relationTo: "users", label: "Ответственный" },
    { name: "internalNotes", type: "textarea", label: "Внутренний комментарий", admin: { description: "Не показывается на сайте" } },
    { name: "utmSource", type: "text", label: "UTM source" },
    { name: "utmMedium", type: "text", label: "UTM medium" },
    { name: "utmCampaign", type: "text", label: "UTM campaign" },
    { name: "utmTerm", type: "text", label: "UTM term" },
    { name: "utmContent", type: "text", label: "UTM content" },
    { name: "landingPage", type: "text", label: "Страница, с которой пришла заявка" },
    { name: "referrer", type: "text", label: "Сайт-источник (referrer)" },
  ],
};
