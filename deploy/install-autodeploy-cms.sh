#!/usr/bin/env bash
# Включает автодеплой CMS: сервер сам подтягивает main и пересобирает контейнер.
#
# Запуск на сервере от root:
#   bash /opt/intech-cms/deploy/install-autodeploy-cms.sh
#
# Отдельные юниты от intech-deploy: сайт и CMS выкладываются независимо, поломка
# одного не задевает другой. Опрос, а не webhook, — входящий SSH на сервер не
# работает, а опросу не нужны ни открытые порты, ни секреты в GitHub.
set -euo pipefail

project_dir=/opt/intech-cms
interval=3min

[[ ${EUID:-$(id -u)} -eq 0 ]] || { echo "запускать от root"; exit 1; }
[[ -d "$project_dir/.git" ]] || { echo "$project_dir не git-репозиторий, сначала deploy/install-cms.sh"; exit 1; }
[[ -f "$project_dir/.env.production" ]] || { echo "нет $project_dir/.env.production"; exit 1; }

cat >/usr/local/bin/intech-cms-deploy <<'SCRIPT'
#!/usr/bin/env bash
# Выкладывает CMS из main, если на GitHub появились новые коммиты.
set -uo pipefail

project_dir=/opt/intech-cms
project=intech-cms
port=3200
lock=/run/intech-cms-deploy.lock
log=/var/log/intech-cms-deploy.log
deploy_key=/root/.ssh/id-intech-deploy

# Репозиторий тянется по https и ключа не требует. Но если origin переведут
# на ssh, у ключа нестандартное имя и ssh сам его не предложит.
if [[ -f "$deploy_key" ]]; then
  export GIT_SSH_COMMAND="ssh -i $deploy_key -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=accept-new"
fi

exec 9>"$lock"
flock -n 9 || exit 0
exec >>"$log" 2>&1

say() { printf '[%s] %s\n' "$(date --iso-8601=seconds)" "$1"; }

cd "$project_dir" || exit 1

# Сначала самая дешёвая проверка: ls-remote тянет только список ссылок.
# Полный fetch и пересборка запускаются, только когда коммит действительно новый.
local_sha="$(git rev-parse HEAD)"
remote_sha="$(git ls-remote origin refs/heads/main 2>&1 | head -1 | cut -f1)"
if [[ ! "$remote_sha" =~ ^[0-9a-f]{40}$ ]]; then
  # Молчать нельзя: при недоступном origin таймер выглядит рабочим,
  # хотя не выкладывает ничего.
  say "не удалось узнать состояние origin/main: $remote_sha"
  exit 1
fi
[[ "$local_sha" == "$remote_sha" ]] && exit 0

git fetch --quiet origin main || { say "fetch не прошёл"; exit 1; }
say "новый коммит $(git log --oneline -1 origin/main)"
git reset --hard --quiet origin/main || { say "reset не прошёл"; exit 1; }

compose_up() {
  docker compose -p "$project" --env-file "$project_dir/.env.production" \
    -f "$project_dir/docker-compose.beget.yml" up -d --build --remove-orphans
}

# Контейнеру нужно время, чтобы начать слушать порт: сразу после up
# curl отдаёт 000 на полностью здоровой CMS.
wait_healthy() {
  for _ in $(seq 1 60); do
    [[ "$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 5 "http://127.0.0.1:$port/admin")" == "200" ]] && return 0
    sleep 3
  done
  return 1
}

rollback() {
  say "откат на $local_sha"
  git reset --hard --quiet "$local_sha"
  compose_up && wait_healthy && say "откат выполнен, CMS снова отвечает" \
    || say "ВНИМАНИЕ: откат не помог, CMS не отвечает"
}

if ! compose_up; then
  say "сборка не прошла"
  rollback
elif ! wait_healthy; then
  # Собралось, но не поднялось: без этой проверки поломка выглядела бы
  # как успешная выкладка.
  say "контейнер собран, но админка не отвечает за три минуты"
  rollback
else
  say "выложено, админка отвечает 200"
  # Каждая сборка оставляет предыдущий образ без тега — иначе диск заполнится
  # за несколько выкладок. Чужие образы не затрагиваются: prune удаляет только
  # висячие слои, у остальных теги на месте.
  docker image prune -f >/dev/null 2>&1
  docker builder prune -f --keep-storage 3GB >/dev/null 2>&1
fi
SCRIPT
chmod +x /usr/local/bin/intech-cms-deploy

cat >/etc/systemd/system/intech-cms-deploy.service <<'UNIT'
[Unit]
Description=Выложить Payload CMS из main, если появились новые коммиты
Wants=network-online.target
After=network-online.target docker.service

[Service]
Type=oneshot
# Без HOME ssh не найдёт ключ в /root/.ssh и git ls-remote вернёт пустоту.
Environment=HOME=/root
ExecStart=/usr/local/bin/intech-cms-deploy
TimeoutStartSec=1800
UNIT

cat >/etc/systemd/system/intech-cms-deploy.timer <<UNIT
[Unit]
Description=Проверять main CMS каждые $interval

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

echo
echo "Автодеплой CMS включён. Проверка каждые $interval."
systemctl list-timers intech-cms-deploy.timer --no-pager
echo
echo "Выложить прямо сейчас:   systemctl start intech-cms-deploy.service"
echo "Смотреть журнал:         tail -f /var/log/intech-cms-deploy.log"
echo "Выключить:               systemctl disable --now intech-cms-deploy.timer"
