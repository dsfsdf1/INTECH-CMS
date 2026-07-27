#!/usr/bin/env bash
set -euo pipefail

# Run from the project directory after the DNS A record
# cms.intechdigital.ru -> 159.194.238.3 has been created.
if [[ ${EUID:-$(id -u)} -ne 0 ]]; then
  echo "Run this command as root."
  exit 1
fi

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
env_file="$project_dir/.env.production"
nginx_source="$project_dir/deploy/nginx-cms.intechdigital.ru.conf"
nginx_target="/etc/nginx/sites-available/cms.intechdigital.ru"

if [[ ! -f "$env_file" && -f /opt/intech-site/.env.production ]]; then
  cp /opt/intech-site/.env.production "$env_file"
fi

if [[ ! -f "$env_file" ]]; then
  echo "Missing $env_file and /opt/intech-site/.env.production"
  exit 1
fi

if grep -q '^NEXT_PUBLIC_SERVER_URL=' "$env_file"; then
  sed -i 's|^NEXT_PUBLIC_SERVER_URL=.*|NEXT_PUBLIC_SERVER_URL=https://cms.intechdigital.ru|' "$env_file"
else
  printf '\nNEXT_PUBLIC_SERVER_URL=https://cms.intechdigital.ru\n' >>"$env_file"
fi

cp "$nginx_source" "$nginx_target"
ln -sfn "$nginx_target" /etc/nginx/sites-enabled/cms.intechdigital.ru
nginx -t
systemctl reload nginx

docker compose -p intech-cms --env-file "$env_file" \
  -f "$project_dir/docker-compose.beget.yml" up -d --build

echo
echo "CMS proxy is ready. Issue TLS certificate next:"
echo "certbot --nginx -d cms.intechdigital.ru"
