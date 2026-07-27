#!/bin/bash
set -u

LOG_FILE=/opt/intech-site/deploy.log
STATUS_FILE=/opt/intech-site/deploy-status.txt
COMPOSE_FILE=/opt/intech-site/docker-compose.beget.yml
ENV_FILE=/opt/intech-site/.env.production

exec >>"$LOG_FILE" 2>&1

echo "=== Payload deployment started: $(date --iso-8601=seconds) ==="
cd /opt/intech-site || exit 1
chmod 600 "$ENV_FILE"

if docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --build; then
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps >"$STATUS_FILE" 2>&1
  echo "=== Payload deployment completed: $(date --iso-8601=seconds) ==="
  rm -f /etc/systemd/system/multi-user.target.wants/intech-deploy-once.service
  rm -f /etc/systemd/system/intech-deploy-once.service
  exit 0
fi

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps >"$STATUS_FILE" 2>&1
echo "=== Payload deployment failed: $(date --iso-8601=seconds) ==="
exit 1
