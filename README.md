# nim-ninja-bot

Telegram-бот, открывающий мини-приложение для игры в Ним.

- **Бот:** https://t.me/nim_ninja_bot
- **Мини-приложение:** https://annovid.github.io/nim-ninja-bot/

## Структура

```
bot/        — Python-бот (pyTelegramBotAPI). На /start присылает кнопку
              «Играть», открывающую WebApp.
webapp/     — Mini App: React + Vite + TypeScript. Деплоится на GitHub Pages.
```

## Запуск бота

1. Создать бота через [@BotFather](https://t.me/BotFather), получить токен.
2. У того же BotFather: `/newapp` или `/mybots → Bot Settings → Menu Button →
   Edit Menu Button URL` — указать URL мини-приложения.
3. Создать `.env` в корне проекта:
   ```dotenv
   TOKEN=<BOT_TOKEN>
   WEBAPP_URL=https://annovid.github.io/nim-ninja-bot/
   ```
4. Запустить:
   ```shell
   docker compose up -d --build
   ```

## Разработка мини-приложения

```shell
cd webapp
npm install
npm run dev          # локальный сервер
npm run build        # сборка в webapp/dist
npm run typecheck    # проверка типов
```

Вне Telegram приложение тоже запустится — игровая логика работает, но
`BackButton`, `CloudStorage` и темизация будут недоступны (прогресс
сохраняется в `localStorage` как фолбэк).

## Деплой мини-приложения

Push в `main` с изменениями в `webapp/**` запускает workflow
`.github/workflows/deploy-webapp.yml`, который собирает и публикует
приложение на GitHub Pages. В репозитории должно быть включено
**Settings → Pages → Source: GitHub Actions**.

## История

Первая версия бота (2018) использовала чат-меню и reply-клавиатуры. Текущая
версия — мини-приложение; вся игровая логика перенесена в TypeScript, бот
стал тонкой обёрткой, которая просто открывает WebApp.
