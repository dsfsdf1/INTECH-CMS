#!/usr/bin/env bash
# Ставит Payload CMS на сервер: клонирует репозиторий в /opt/intech-cms,
# поднимает контейнеры, отдаёт CMS на cms.intechdigital.ru через общий Caddy
# и включает автообновление из main.
#
# Запуск на сервере от root:
#   bash /opt/intech-cms/deploy/install-cms.sh
#
# Скрипт идемпотентный: повторный запуск обновляет код и конфигурацию,
# но не трогает уже созданные пароли и базу.
set -euo pipefail

project_dir=/opt/intech-cms
repo=https://github.com/dsfsdf1/INTECH-CMS.git
domain=cms.intechdigital.ru
port=3200
project=intech-cms

[[ ${EUID:-$(id -u)} -eq 0 ]] || { echo "запускать от root"; exit 1; }
command -v docker >/dev/null || { echo "docker не установлен"; exit 1; }

say() { printf '\n== %s\n' "$1"; }

say "код из $repo"
if [[ -d "$project_dir/.git" ]]; then
  git -C "$project_dir" fetch --quiet origin main
  git -C "$project_dir" reset --hard --quiet origin/main
else
  # Каталог мог остаться от выкладки архивом — она не оставляет .git.
  [[ -e "$project_dir" ]] && mv "$project_dir" "$project_dir.before-git-$(date +%s)"
  git clone --quiet "$repo" "$project_dir"
fi
git -C "$project_dir" log --oneline -1

say "настройки"
env_file="$project_dir/.env.production"
if [[ -f "$env_file" ]]; then
  echo "$env_file уже есть, пароли не трогаем"
else
  # POSTGRES_PASSWORD попадает в том базы при первом запуске: сменить его
  # позже нельзя, не переустановив базу. Поэтому файл создаётся только раз.
  umask 077
  cat >"$env_file" <<EOF
NODE_ENV=production
PAYLOAD_SECRET=$(openssl rand -hex 32)
POSTGRES_PASSWORD=$(openssl rand -hex 24)
NEXT_PUBLIC_SERVER_URL=https://$domain
CMS_ALLOWED_ORIGINS=https://intechdigital.ru,https://www.intechdigital.ru
EOF
  echo "создан $env_file со свежими секретами"
fi
chmod 600 "$env_file"

say "сборка и запуск"
docker compose -p "$project" --env-file "$env_file" \
  -f "$project_dir/docker-compose.beget.yml" up -d --build --remove-orphans

say "ждём, пока админка ответит"
healthy=no
for _ in $(seq 1 60); do
  if [[ "$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 5 "http://127.0.0.1:$port/admin")" == "200" ]]; then
    healthy=yes
    break
  fi
  sleep 3
done
[[ "$healthy" == yes ]] || {
  echo "CMS не ответила на 127.0.0.1:$port за три минуты, смотрите:"
  echo "  docker compose -p $project -f $project_dir/docker-compose.beget.yml logs --tail 50"
  exit 1
}
echo "CMS отвечает на 127.0.0.1:$port"

say "публикация домена $domain"
configure_caddy() {
  local caddy mount host_conf container_conf backup
  # 80 и 443 занимает Caddy из проекта price-monitoring, nginx туда не встанет.
  caddy="$(docker ps --format '{{.Names}}' | grep -m1 caddy || true)"
  [[ -n "$caddy" ]] || { echo "контейнер Caddy не найден — проксирование настройте вручную"; return 1; }

  # Внутри контейнера 127.0.0.1 своё, поэтому Caddy пускаем в сеть проекта
  # и проксируем прямо на контейнер CMS по имени.
  docker network connect "${project}_default" "$caddy" 2>/dev/null || true

  # Путь к Caddyfile на хосте и внутри контейнера разный — берём из монтирований.
  mount="$(docker inspect -f '{{range .Mounts}}{{.Source}}|{{.Destination}}{{"\n"}}{{end}}' "$caddy" | grep -i caddyfile | head -1)"
  host_conf="${mount%%|*}"
  container_conf="${mount##*|}"
  [[ -f "$host_conf" ]] || { host_conf=/opt/pricing/infra/Caddyfile; container_conf=/etc/caddy/Caddyfile; }
  [[ -f "$host_conf" ]] || { echo "не нашёл Caddyfile — проксирование настройте вручную"; return 1; }

  if grep -qF "$domain" "$host_conf"; then
    echo "$domain уже описан в $host_conf"
  else
    backup="$host_conf.bak-$(date +%s)"
    cp "$host_conf" "$backup"
    printf '\n%s {\n\treverse_proxy %s-web-1:3000\n}\n' "$domain" "$project" >>"$host_conf"
    if ! docker exec "$caddy" caddy validate --adapter caddyfile --config "$container_conf" >/dev/null 2>&1; then
      cp "$backup" "$host_conf"
      echo "Caddy не принял блок для $domain, конфиг возвращён из $backup"
      return 1
    fi
  fi

  docker exec "$caddy" caddy reload --adapter caddyfile --config "$container_conf" >/dev/null
  echo "Caddy отдаёт https://$domain (сертификат он получит сам)"
}
configure_caddy || echo "ВНИМАНИЕ: домен не опубликован, CMS пока доступна только внутри сервера"

say "автообновление из git"
bash "$project_dir/deploy/install-autodeploy-cms.sh"

cat <<EOF

Готово.
  Админка:        https://$domain/admin
  Первый вход:    там же создаётся первый пользователь
  Секреты:        $env_file (в git не попадают)
  Журнал выкладок: tail -f /var/log/intech-cms-deploy.log
EOF
