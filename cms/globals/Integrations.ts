import type { GlobalConfig } from "payload";
import { adminOnly } from "../access";

export const Integrations: GlobalConfig = {
  slug: "integrations",
  label: "Интеграции",
  admin: { group: "Продажи" },
  access: { read: adminOnly, update: adminOnly },
  fields: [
    { name: "telegram", type: "group", label: "Telegram", fields: [{ name: "enabled", type: "checkbox", label: "Включить уведомления", defaultValue: false }, { name: "botToken", type: "text", label: "Токен бота" }, { name: "chatId", type: "text", label: "ID чата" }] },
    { name: "bitrix24", type: "group", label: "Bitrix24", fields: [{ name: "enabled", type: "checkbox", label: "Включить отправку", defaultValue: false }, { name: "webhookUrl", type: "text", label: "Webhook URL" }] },
    { name: "amoCrm", type: "group", label: "amoCRM", fields: [{ name: "enabled", type: "checkbox", label: "Включить отправку", defaultValue: false }, { name: "webhookUrl", type: "text", label: "Webhook URL" }] },
  ],
};
