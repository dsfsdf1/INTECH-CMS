import type { CollectionConfig } from "payload";
import { adminOnly } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Владелец", plural: "Владельцы" },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  admin: {
    useAsTitle: "email",
    group: "Система",
  },
  access: {
    create: async ({ req }) => {
      if (req.user?.role === "admin") return true;
      const existing = await req.payload.count({ collection: "users" });
      return existing.totalDocs === 0;
    },
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Имя",
    },
    {
      name: "role",
      type: "select",
      label: "Роль",
      defaultValue: "editor",
      saveToJWT: true,
      options: [
        { label: "Администратор", value: "admin" },
        { label: "Редактор", value: "editor" },
      ],
    },
  ],
};
