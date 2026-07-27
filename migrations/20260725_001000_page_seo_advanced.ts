import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page" ADD COLUMN "seo_advanced_keywords" varchar;
    ALTER TABLE "home_page" ADD COLUMN "seo_advanced_canonical_url" varchar;
    ALTER TABLE "home_page" ADD COLUMN "seo_advanced_robots" varchar DEFAULT 'index,follow';
    ALTER TABLE "home_page" ADD COLUMN "seo_advanced_og_title" varchar;
    ALTER TABLE "home_page" ADD COLUMN "seo_advanced_og_description" varchar;
    ALTER TABLE "home_page" ADD COLUMN "seo_advanced_og_url" varchar;
    ALTER TABLE "home_page" ADD COLUMN "seo_advanced_og_type" varchar DEFAULT 'website';
    ALTER TABLE "home_page" ADD COLUMN "seo_advanced_twitter_title" varchar;
    ALTER TABLE "home_page" ADD COLUMN "seo_advanced_twitter_description" varchar;
    ALTER TABLE "home_page" ADD COLUMN "seo_advanced_focus_keyword" varchar;
    ALTER TABLE "home_page" ADD COLUMN "seo_advanced_schema_org" varchar;
    ALTER TABLE "automation_page" ADD COLUMN "seo_advanced_keywords" varchar;
    ALTER TABLE "automation_page" ADD COLUMN "seo_advanced_canonical_url" varchar;
    ALTER TABLE "automation_page" ADD COLUMN "seo_advanced_robots" varchar DEFAULT 'index,follow';
    ALTER TABLE "automation_page" ADD COLUMN "seo_advanced_og_title" varchar;
    ALTER TABLE "automation_page" ADD COLUMN "seo_advanced_og_description" varchar;
    ALTER TABLE "automation_page" ADD COLUMN "seo_advanced_og_url" varchar;
    ALTER TABLE "automation_page" ADD COLUMN "seo_advanced_og_type" varchar DEFAULT 'website';
    ALTER TABLE "automation_page" ADD COLUMN "seo_advanced_twitter_title" varchar;
    ALTER TABLE "automation_page" ADD COLUMN "seo_advanced_twitter_description" varchar;
    ALTER TABLE "automation_page" ADD COLUMN "seo_advanced_focus_keyword" varchar;
    ALTER TABLE "automation_page" ADD COLUMN "seo_advanced_schema_org" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page" DROP COLUMN "seo_advanced_keywords", DROP COLUMN "seo_advanced_canonical_url", DROP COLUMN "seo_advanced_robots", DROP COLUMN "seo_advanced_og_title", DROP COLUMN "seo_advanced_og_description", DROP COLUMN "seo_advanced_og_url", DROP COLUMN "seo_advanced_og_type", DROP COLUMN "seo_advanced_twitter_title", DROP COLUMN "seo_advanced_twitter_description", DROP COLUMN "seo_advanced_focus_keyword", DROP COLUMN "seo_advanced_schema_org";
    ALTER TABLE "automation_page" DROP COLUMN "seo_advanced_keywords", DROP COLUMN "seo_advanced_canonical_url", DROP COLUMN "seo_advanced_robots", DROP COLUMN "seo_advanced_og_title", DROP COLUMN "seo_advanced_og_description", DROP COLUMN "seo_advanced_og_url", DROP COLUMN "seo_advanced_og_type", DROP COLUMN "seo_advanced_twitter_title", DROP COLUMN "seo_advanced_twitter_description", DROP COLUMN "seo_advanced_focus_keyword", DROP COLUMN "seo_advanced_schema_org";
  `)
}
