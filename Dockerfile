FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Без TTY corepack спрашивает подтверждение на скачивание pnpm и ждёт ответа
# вечно: под systemd сборка из-за этого зависала на середине.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Один поток libvips вместо потока на ядро: пик памяти при оптимизации
# картинок иначе не помещается в память сервера, и ядро убивает соседей.
ENV VIPS_CONCURRENCY=1
# Payload validates production variables while Next.js compiles route modules.
# These build-only values are replaced by docker-compose at container runtime.
ENV DATABASE_URI=postgresql://intech:intech@127.0.0.1:5432/intech
ENV PAYLOAD_SECRET=build-only-payload-secret-not-used-at-runtime
ENV NEXT_PUBLIC_SERVER_URL=http://localhost:3000
RUN pnpm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN mkdir -p /app/public/media && chown -R nextjs:nodejs /app/public/media
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
