#!/usr/bin/env bash
set -euo pipefail

# One-command installer for servers where the project was deployed from an
# archive rather than cloned with Git.
domain="cms.intechdigital.ru"
repository_archive="https://github.com/MIhAIl1534/INTECH/archive/refs/heads/main.tar.gz"
source_env="/opt/intech-site/.env.production"
release_dir="/opt/intech-cms-release"
nginx_target="/etc/nginx/sites-available/$domain"

if [[ ${EUID:-$(id -u)} -ne 0 ]]; then
  echo "Run as root."
  exit 1
fi

if [[ ! -f "$source_env" ]]; then
  echo "Cannot find production settings: $source_env"
  exit 1
fi

if ! getent hosts "$domain" >/dev/null; then
  echo "DNS record is not ready: create A record $domain -> 159.194.238.3 first."
  exit 1
fi

temporary_dir="$(mktemp -d)"
trap 'rm -rf "$temporary_dir"' EXIT

mkdir -p "$release_dir"
curl -fsSL "$repository_archive" | tar -xzf - -C "$release_dir" --strip-components=1
cp "$source_env" "$release_dir/.env.production"

if grep -q '^NEXT_PUBLIC_SERVER_URL=' "$release_dir/.env.production"; then
  sed -i "s|^NEXT_PUBLIC_SERVER_URL=.*|NEXT_PUBLIC_SERVER_URL=https://$domain|" "$release_dir/.env.production"
else
  printf '\nNEXT_PUBLIC_SERVER_URL=https://%s\n' "$domain" >>"$release_dir/.env.production"
fi

cp "$release_dir/deploy/nginx-cms.intechdigital.ru.conf" "$nginx_target"
ln -sfn "$nginx_target" "/etc/nginx/sites-enabled/$domain"
nginx -t
systemctl reload nginx

docker compose -p intech-cms --env-file "$release_dir/.env.production" \
  -f "$release_dir/docker-compose.beget.yml" up -d --build

echo
echo "CMS is available over HTTP. Install its TLS certificate with:"
echo "apt-get update && apt-get install -y certbot python3-certbot-nginx && certbot --nginx -d $domain"
