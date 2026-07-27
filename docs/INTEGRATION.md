# Подключение сайтов к CMS

CMS работает как независимый headless-сервис. Сайт не импортирует Payload и
общается с ним только по REST API.

## Окружения

Для каждого сайта задаются собственные переменные:

```dotenv
CMS_URL=https://cms.intechdigital.ru
CMS_SITE_KEY=intechdigital
```

В CMS список origin-ов задаётся через `CMS_ALLOWED_ORIGINS`:

```dotenv
CMS_ALLOWED_ORIGINS=https://intechdigital.ru,https://staging.intechdigital.ru
```

## Публичное чтение

Публичный сайт читает только опубликованные записи:

```text
GET /api/globals/home-page?depth=1
GET /api/globals/automation-page?depth=1
GET /api/globals/site-settings?depth=1
GET /api/directions?where[visible][equals]=true&sort=order&depth=1
GET /api/cases?where[visible][equals]=true&sort=order&depth=1
GET /api/media/:id
```

Изменение контента выполняется только через Payload Admin. Публичный сайт не
должен хранить Payload-секрет и не должен выполнять mutation-запросы.

## Порядок запуска

1. Поднять CMS локально и проверить API.
2. Развернуть CMS на staging-домене и отдельной базе.
3. Подключить тестовую копию сайта через `CMS_URL`.
4. Проверить контент, медиа, SEO и fallback.
5. Только после этого переключить production-сайт.
