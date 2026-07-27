import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "automation_page_problems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"before" varchar NOT NULL,
  	"after" varchar NOT NULL,
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "automation_page_flow_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "automation_page_integrations_systems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "automation_page_formats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"media_id" integer,
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "automation_page_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"visible" boolean DEFAULT true
  );
  
  ALTER TABLE "automation_page" ALTER COLUMN "hero_title" SET DEFAULT 'Автоматизируем продажи, заявки, документы и отчётность — от первого действия до управленческого решения.';
  ALTER TABLE "automation_page" ALTER COLUMN "hero_text" SET DEFAULT 'Связываем CRM, 1С, сайты, мессенджеры и внутренние сервисы. Убираем ручные операции, настраиваем контроль процессов и показываем руководителю актуальные данные.';
  ALTER TABLE "automation_page" ALTER COLUMN "hero_primary_label" SET DEFAULT 'Разобрать мой процесс';
  ALTER TABLE "automation_page" ALTER COLUMN "hero_primary_url" SET DEFAULT '#contact';
  ALTER TABLE "automation_page" ALTER COLUMN "hero_secondary_label" SET DEFAULT 'Посмотреть кейсы';
  ALTER TABLE "automation_page" ALTER COLUMN "hero_secondary_url" SET DEFAULT '#cases';
  ALTER TABLE "automation_page" ALTER COLUMN "hero_systems_line" SET DEFAULT 'CRM · 1С · iiko · Telegram · API · BI · AI-агенты';
  ALTER TABLE "automation_page" ADD COLUMN "flow_title" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "flow_text" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "directions_intro_title" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "directions_intro_text" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "cases_intro_title" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "cases_intro_text" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "facts_intro_title" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "integrations_title" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "integrations_text" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "stages_intro_title" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "stages_intro_text" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "formats_title" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "formats_text" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "pricing_title" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "pricing_subtitle" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "pricing_footer_text" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "pricing_button_label" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "pricing_button_url" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "reviews_intro_title" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "faq_title" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "contact_title" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "contact_accent" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "contact_text" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "contact_note" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "contact_submit_label" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "contact_success_label" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "contact_telegram_label" varchar;
  ALTER TABLE "automation_page" ADD COLUMN "footer_tagline" varchar;
  ALTER TABLE "automation_page_problems" ADD CONSTRAINT "automation_page_problems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."automation_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "automation_page_flow_items" ADD CONSTRAINT "automation_page_flow_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."automation_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "automation_page_integrations_systems" ADD CONSTRAINT "automation_page_integrations_systems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."automation_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "automation_page_formats_items" ADD CONSTRAINT "automation_page_formats_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "automation_page_formats_items" ADD CONSTRAINT "automation_page_formats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."automation_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "automation_page_faq_items" ADD CONSTRAINT "automation_page_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."automation_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "automation_page_problems_order_idx" ON "automation_page_problems" USING btree ("_order");
  CREATE INDEX "automation_page_problems_parent_id_idx" ON "automation_page_problems" USING btree ("_parent_id");
  CREATE INDEX "automation_page_flow_items_order_idx" ON "automation_page_flow_items" USING btree ("_order");
  CREATE INDEX "automation_page_flow_items_parent_id_idx" ON "automation_page_flow_items" USING btree ("_parent_id");
  CREATE INDEX "automation_page_integrations_systems_order_idx" ON "automation_page_integrations_systems" USING btree ("_order");
  CREATE INDEX "automation_page_integrations_systems_parent_id_idx" ON "automation_page_integrations_systems" USING btree ("_parent_id");
  CREATE INDEX "automation_page_formats_items_order_idx" ON "automation_page_formats_items" USING btree ("_order");
  CREATE INDEX "automation_page_formats_items_parent_id_idx" ON "automation_page_formats_items" USING btree ("_parent_id");
  CREATE INDEX "automation_page_formats_items_media_idx" ON "automation_page_formats_items" USING btree ("media_id");
  CREATE INDEX "automation_page_faq_items_order_idx" ON "automation_page_faq_items" USING btree ("_order");
  CREATE INDEX "automation_page_faq_items_parent_id_idx" ON "automation_page_faq_items" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "automation_page_problems" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "automation_page_flow_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "automation_page_integrations_systems" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "automation_page_formats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "automation_page_faq_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "automation_page_problems" CASCADE;
  DROP TABLE "automation_page_flow_items" CASCADE;
  DROP TABLE "automation_page_integrations_systems" CASCADE;
  DROP TABLE "automation_page_formats_items" CASCADE;
  DROP TABLE "automation_page_faq_items" CASCADE;
  ALTER TABLE "automation_page" ALTER COLUMN "hero_title" DROP DEFAULT;
  ALTER TABLE "automation_page" ALTER COLUMN "hero_text" DROP DEFAULT;
  ALTER TABLE "automation_page" ALTER COLUMN "hero_primary_label" DROP DEFAULT;
  ALTER TABLE "automation_page" ALTER COLUMN "hero_primary_url" DROP DEFAULT;
  ALTER TABLE "automation_page" ALTER COLUMN "hero_secondary_label" DROP DEFAULT;
  ALTER TABLE "automation_page" ALTER COLUMN "hero_secondary_url" DROP DEFAULT;
  ALTER TABLE "automation_page" ALTER COLUMN "hero_systems_line" DROP DEFAULT;
  ALTER TABLE "automation_page" DROP COLUMN "flow_title";
  ALTER TABLE "automation_page" DROP COLUMN "flow_text";
  ALTER TABLE "automation_page" DROP COLUMN "directions_intro_title";
  ALTER TABLE "automation_page" DROP COLUMN "directions_intro_text";
  ALTER TABLE "automation_page" DROP COLUMN "cases_intro_title";
  ALTER TABLE "automation_page" DROP COLUMN "cases_intro_text";
  ALTER TABLE "automation_page" DROP COLUMN "facts_intro_title";
  ALTER TABLE "automation_page" DROP COLUMN "integrations_title";
  ALTER TABLE "automation_page" DROP COLUMN "integrations_text";
  ALTER TABLE "automation_page" DROP COLUMN "stages_intro_title";
  ALTER TABLE "automation_page" DROP COLUMN "stages_intro_text";
  ALTER TABLE "automation_page" DROP COLUMN "formats_title";
  ALTER TABLE "automation_page" DROP COLUMN "formats_text";
  ALTER TABLE "automation_page" DROP COLUMN "pricing_title";
  ALTER TABLE "automation_page" DROP COLUMN "pricing_subtitle";
  ALTER TABLE "automation_page" DROP COLUMN "pricing_footer_text";
  ALTER TABLE "automation_page" DROP COLUMN "pricing_button_label";
  ALTER TABLE "automation_page" DROP COLUMN "pricing_button_url";
  ALTER TABLE "automation_page" DROP COLUMN "reviews_intro_title";
  ALTER TABLE "automation_page" DROP COLUMN "faq_title";
  ALTER TABLE "automation_page" DROP COLUMN "contact_title";
  ALTER TABLE "automation_page" DROP COLUMN "contact_accent";
  ALTER TABLE "automation_page" DROP COLUMN "contact_text";
  ALTER TABLE "automation_page" DROP COLUMN "contact_note";
  ALTER TABLE "automation_page" DROP COLUMN "contact_submit_label";
  ALTER TABLE "automation_page" DROP COLUMN "contact_success_label";
  ALTER TABLE "automation_page" DROP COLUMN "contact_telegram_label";
  ALTER TABLE "automation_page" DROP COLUMN "footer_tagline";`)
}
