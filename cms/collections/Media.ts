import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionConfig } from "payload";
import { authenticated, publicRead } from "../access";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Медиафайл", plural: "Медиа" },
  admin: {
    group: "Контент",
    useAsTitle: "alt",
  },
  access: {
    create: authenticated,
    read: publicRead,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: path.resolve(dirname, "../../public/media"),
    mimeTypes: ["image/*", "video/*"],
    imageSizes: [
      { name: "card", width: 960, height: 720, position: "centre" },
      { name: "wide", width: 1920, height: 1080, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Альтернативный текст",
      required: true,
    },
    {
      name: "caption",
      type: "textarea",
      label: "Подпись",
    },
  ],
};
