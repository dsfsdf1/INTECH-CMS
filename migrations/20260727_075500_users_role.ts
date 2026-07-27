import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Поле role у пользователей появилось после первой миграции, но в миграции не
// попало: в разработке схему досыпает push, а он выключен в production. На
// чистой базе админка из-за этого падала на users.role does not exist.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "enum_users_role" DEFAULT 'editor';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
    DROP TYPE IF EXISTS "public"."enum_users_role";
  `)
}
