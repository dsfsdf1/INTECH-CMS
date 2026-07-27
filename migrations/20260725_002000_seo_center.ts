import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN "seo_center_site_url" varchar;
    ALTER TABLE "site_settings" ADD COLUMN "seo_center_site_name" varchar DEFAULT 'ИНТЕХ';
    ALTER TABLE "site_settings" ADD COLUMN "seo_center_organization_type" varchar DEFAULT 'Organization';
    ALTER TABLE "site_settings" ADD COLUMN "seo_center_organization_name" varchar;
    ALTER TABLE "site_settings" ADD COLUMN "seo_center_social_links" varchar;
    ALTER TABLE "site_settings" ADD COLUMN "seo_center_robots_text" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN "seo_center_site_url", DROP COLUMN "seo_center_site_name", DROP COLUMN "seo_center_organization_type", DROP COLUMN "seo_center_organization_name", DROP COLUMN "seo_center_social_links", DROP COLUMN "seo_center_robots_text";
  `)
}
