#!/usr/bin/env bash
set -euo pipefail

# Independent pull-based deployer for Payload CMS.
# It does not change the existing intech-site deploy timer.
project_dir=/opt/intech-cms
interval=3min
[[ ${EUID:-$(id -u)} -eq 0 ]] || { echo 'run as root'; exit 1; }
[[ -f "$project_dir/.env.production" ]] || { echo "missing $project_dir/.env.production"; exit 1; }

cat >/usr/local/bin/intech-cms-deploy <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail
project_dir=/opt/intech-cms
archive=https://github.com/dsfsdf1/INTECH-CMS/archive/refs/heads/main.tar.gz
lock=/run/intech-cms-deploy.lock
log=/var/log/intech-cms-deploy.log
exec 9>"$lock"; flock -n 9 || exit 0
exec >>"$log" 2>&1
say(){ printf '[%s] %s\n' "$(date --iso-8601=seconds)" "$1"; }
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
if ! curl -fsSL "$archive" | tar -xzf - -C "$tmp" --strip-components=1; then say 'download failed'; exit 1; fi
cp "$project_dir/.env.production" "$tmp/.env.production"
old="${project_dir}.previous"; rm -rf "$old"; mv "$project_dir" "$old"; mv "$tmp" "$project_dir"; tmp=''
if docker compose -p intech-cms --env-file "$project_dir/.env.production" -f "$project_dir/docker-compose.beget.yml" up -d --build --remove-orphans && \
   curl -fsS --max-time 10 http://127.0.0.1:3200/admin >/dev/null; then
  say 'CMS deployed'; rm -rf "$old"; exit 0
fi
say 'deploy failed; rolling back'; docker compose -p intech-cms --env-file "$project_dir/.env.production" -f "$project_dir/docker-compose.beget.yml" down || true
rm -rf "$project_dir"; mv "$old" "$project_dir"
docker compose -p intech-cms --env-file "$project_dir/.env.production" -f "$project_dir/docker-compose.beget.yml" up -d
exit 1
SCRIPT
chmod +x /usr/local/bin/intech-cms-deploy

cat >/etc/systemd/system/intech-cms-deploy.service <<'UNIT'
[Unit]
Description=Deploy standalone Payload CMS from GitHub
After=network-online.target docker.service
[Service]
Type=oneshot
Environment=HOME=/root
ExecStart=/usr/local/bin/intech-cms-deploy
TimeoutStartSec=1800
UNIT

cat >/etc/systemd/system/intech-cms-deploy.timer <<UNIT
[Unit]
Description=Check Payload CMS every $interval
[Timer]
OnBootSec=3min
OnUnitActiveSec=$interval
AccuracySec=30s
Unit=intech-cms-deploy.service
[Install]
WantedBy=timers.target
UNIT

touch /var/log/intech-cms-deploy.log
systemctl daemon-reload
systemctl enable --now intech-cms-deploy.timer
systemctl start intech-cms-deploy.service
