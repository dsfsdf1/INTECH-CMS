# Выкладка CMS на сервер

CMS живёт на сервере `159.194.238.3` в `/opt/intech-cms` — это обычный клон
этого репозитория. Домен — `cms.intechdigital.ru`, контейнер слушает только
`127.0.0.1:3200`, наружу его отдаёт общий Caddy (`pricing-caddy-1`), который
уже занимает 80 и 443. Сайт (`/opt/intech-site`) и его таймер `intech-deploy`
не затрагиваются: у CMS свои юниты, своя база и свой том.

## Установка

Входящий SSH на сервер не работает, всё набирается в Терминале (VNC) в панели
Beget. Консоль не передаёт Shift, поэтому в строках нет ни одного шифтового
символа — `wget` без схемы сам подставит http, а GitHub переведёт на https:

```
wget -O /tmp/cms.tar.gz codeload.github.com/dsfsdf1/INTECH-CMS/tar.gz/refs/heads/main
mkdir -p /tmp/cms
tar -xzf /tmp/cms.tar.gz -C /tmp/cms --strip-components 1
bash /tmp/cms/deploy/install-cms.sh
```

Архив нужен только чтобы занести в консоль первую команду: `install-cms.sh`
дальше делает настоящий `git clone` в `/opt/intech-cms`, и обновляется сервер
уже из git. Секреты, сборка, домен в Caddy и таймер — тоже на нём.

Повторный запуск безопасен: код обновляется, `.env.production` и база
остаются на месте.

## Что появляется на сервере

| Что | Где |
| --- | --- |
| Код | `/opt/intech-cms` |
| Секреты | `/opt/intech-cms/.env.production` (в git не попадают) |
| Контейнеры | проект compose `intech-cms`: `intech-cms-web-1`, `intech-cms-db-1` |
| Автодеплой | `intech-cms-deploy.timer`, раз в 3 минуты |
| Журнал | `/var/log/intech-cms-deploy.log` |

## Автообновление

Таймер раз в три минуты спрашивает у GitHub состояние `main` через
`git ls-remote` — это несколько килобайт. Если коммит новый, репозиторий
переводится на него и контейнер пересобирается. Если сборка не прошла или
админка не ответила за три минуты, выкладка откатывается на прежний коммит.

```
systemctl start intech-cms-deploy.service   # выложить прямо сейчас
tail -f /var/log/intech-cms-deploy.log      # смотреть журнал
systemctl disable --now intech-cms-deploy.timer
```

`POSTGRES_PASSWORD` попадает в том базы при первом запуске — менять его позже
нельзя, не переустановив базу. Поэтому `.env.production` создаётся один раз и
скриптом больше не перезаписывается.
