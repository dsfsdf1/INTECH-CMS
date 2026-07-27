# vinext-starter

# ИНТЕХ — отдельный Payload CMS

Этот каталог — самостоятельное приложение CMS. Оно не импортируется сайтом и
не использует его контейнер, порт или файловую систему. Админка доступна по
`/admin`, REST API — по `/api`, база — отдельный PostgreSQL volume.

## Локальный запуск

```bash
cp .env.example .env.production
pnpm install
pnpm dev
```

Минимальные переменные: `DATABASE_URI`, `PAYLOAD_SECRET`,
`NEXT_PUBLIC_SERVER_URL`, `PAYLOAD_ADMIN_EMAIL`, `PAYLOAD_ADMIN_PASSWORD`.

## Production

```bash
docker compose -p intech-cms --env-file .env.production \
  -f docker-compose.beget.yml up -d --build
```

CMS слушает только `127.0.0.1:3200`; наружу её следует отдавать отдельным
доменом `cms.intechdigital.ru` через reverse proxy. Основной сайт может читать
публичные данные через `https://cms.intechdigital.ru/api/...` и не зависит от
внутренней реализации Payload.

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
# ИНТЕХ — сайт и Payload CMS

## Адрес административной панели в production

Публичный WordPress использует `intechdigital.ru` и его `/wp-admin/`. Payload
должен быть доступен отдельно: `https://cms.intechdigital.ru/admin`.
Это исключает конфликт маршрута `/admin` с WordPress и настройками хостинга.

На сервере:

1. Создайте DNS-запись `cms.intechdigital.ru` типа `A` на `159.194.238.3`.
2. Скопируйте `deploy/nginx-cms.intechdigital.ru.conf` в
   `/etc/nginx/sites-available/cms.intechdigital.ru` и включите её:

   ```bash
   ln -s /etc/nginx/sites-available/cms.intechdigital.ru /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   ```

3. Выпустите сертификат для поддомена (если на сервере используется Certbot):

   ```bash
   certbot --nginx -d cms.intechdigital.ru
   ```

4. В `/opt/intech-site/.env.production` укажите:

   ```dotenv
   NEXT_PUBLIC_SERVER_URL=https://cms.intechdigital.ru
   ```

   Затем пересоберите контейнер: `docker compose --env-file .env.production -f docker-compose.beget.yml up -d --build`.

Панель будет доступна только после авторизации Payload по адресу
`https://cms.intechdigital.ru/admin`.
