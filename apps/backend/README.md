# apps/backend

Здесь теперь лежат две части backend-направления:

- `preview-server.mjs` — запускаемый локально preview API без внешних зависимостей;
- `src/` — каркас backend-приложения на `NestJS`, к которому можно перейти после установки пакетов.

## Preview API

Preview API нужен, чтобы уже сейчас проверять frontend не на `mock-data`, а на настоящих HTTP-запросах.

Запуск из корня:

```bash
npm run dev:api-preview
```

По умолчанию сервер поднимается на `http://localhost:4100/api`.

## Демо-доступы

- `employee@annaelle.ru` / `demo123`
- `admin@annaelle.ru` / `demo123`

## Целевое направление

Каталог `src/` подготавливает переход к `NestJS + REST + PostgreSQL`, но для текущего MVP мы оставляем запускамую preview-реализацию максимально простой.
