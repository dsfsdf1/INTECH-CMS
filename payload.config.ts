import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
import { Users } from "./cms/collections/Users";
import { Media } from "./cms/collections/Media";
import { Leads } from "./cms/collections/Leads";
import {
  Cases,
  Directions,
  Facts,
  Products,
  Reviews,
  Stages,
} from "./cms/collections/contentCollections";
import { SiteSettings } from "./cms/globals/SiteSettings";
import { HomePage } from "./cms/globals/HomePage";
import { AutomationPage } from "./cms/globals/AutomationPage";
import { Integrations } from "./cms/globals/Integrations";
import { migrations } from "./migrations";
import { seedInitialContent } from "./cms/seed";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";
const configuredOrigins = (process.env.CMS_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);
const allowedOrigins = Array.from(
  new Set([
    serverURL,
    ...configuredOrigins,
    "http://localhost:3000",
    "http://localhost:3100",
    "http://127.0.0.1:3100",
  ]),
);
if (process.env.NODE_ENV === "production") {
  for (const key of ["DATABASE_URI", "PAYLOAD_SECRET", "NEXT_PUBLIC_SERVER_URL"]) {
    if (!process.env[key]) throw new Error(`Missing required production environment variable: ${key}`);
  }
}
const hasS3 = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_ENDPOINT &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY,
);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: {
      titleSuffix: "— ИНТЕХ",
    },
  },
  collections: [Users, Media, Leads, Facts, Directions, Stages, Reviews, Cases, Products],
  globals: [SiteSettings, HomePage, AutomationPage, Integrations],
  // In production this is the CMS subdomain, for example
  // https://cms.intechdigital.ru. Keeping it here makes admin login and
  // uploads work behind the reverse proxy without opening CORS broadly.
  cors: allowedOrigins,
  csrf: allowedOrigins,
  db: postgresAdapter({
    push: process.env.NODE_ENV !== "production",
    prodMigrations: migrations,
    pool: {
      connectionString:
        process.env.DATABASE_URI ??
        "postgresql://intech:intech@127.0.0.1:5432/intech",
    },
  }),
  editor: lexicalEditor(),
  bodyParser: {
    limits: { fileSize: 25 * 1024 * 1024 },
  },
  secret: process.env.PAYLOAD_SECRET ?? "local-development-secret-change-me",
  serverURL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  plugins: hasS3
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET!,
          config: {
            endpoint: process.env.S3_ENDPOINT!,
            region: process.env.S3_REGION ?? "ru-1",
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID!,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
            forcePathStyle: true,
          },
        }),
      ]
    : [],
  onInit: async (payload) => {
    const email = process.env.PAYLOAD_ADMIN_EMAIL;
    const password = process.env.PAYLOAD_ADMIN_PASSWORD;
    if (!email || !password) return;

    const users = await payload.count({ collection: "users" });
    if (users.totalDocs === 0) {
      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          name: "Владелец сайта",
          role: "admin",
        },
        overrideAccess: true,
      });
      payload.logger.info(`Created the initial Payload owner: ${email}`);
    }

    await seedInitialContent(payload);
  },
});
