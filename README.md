# Dishes App

Небольшое веб-приложение для управления меню блюд.

Приложение позволяет просматривать блюда, искать их по названию и ингредиентам, фильтровать по категориям, а также создавать, редактировать и удалять блюда.

## Стек

* React 19.3.0
* TypeScript 6.0.3
* Vite 8.3.0
* React Router 7.18.4 - Data Mode
* TanStack Query 5.103.2
* Axios 1.20.0
* React Hook Form 7.88.0
* Zod 4.6.5
* Tailwind CSS 4.3.3
* Lucide React 1.47.0
* JSON Server 1.0.0-beta.15
* Vitest 5.0.1
* Testing Library

## Возможности

* Просмотр списка блюд
* Поиск по названию и ингредиентам
* Фильтрация по категориям
* Создание блюда
* Редактирование блюда
* Удаление блюда с подтверждением
* Валидация формы
* Состояния загрузки и ошибок
* Обработка ошибок API
* Пустое состояние списка
* Адаптивная верстка
* Mock API на базе JSON Server
* Тестирование схем валидации, API-слоя и UI-компонентов

## Архитектура

Проект разделён по ответственности:

```text
src/
├── api/          # API-запросы
├── components/   # UI-компоненты
├── hooks/        # TanStack Query mutations
├── lib/          # Axios и QueryClient
├── pages/        # Страницы приложения
├── schemas/      # Zod-схемы валидации
├── tests/        # Тесты
├── types/        # TypeScript-типы
├── index.css     # Глобальные стили
├── main.tsx      # Точка входа
└── router.tsx    # Маршрутизация
```

Логика работы с API отделена от UI, а серверное состояние управляется через TanStack Query.

## Запуск проекта

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск Mock API

В отдельном терминале:

```bash
npm run server
```

JSON Server будет доступен по адресу:

```text
http://localhost:3001
```

### 3. Запуск приложения

В другом терминале:

```bash
npm run dev
```

После запуска приложение будет доступно по адресу:

```text
http://localhost:5173
```

## Доступные команды

```bash
npm run dev
```

Запуск frontend в режиме разработки.

```bash
npm run server
```

Запуск Mock API через JSON Server.

```bash
npm run build
```

Проверка TypeScript и production-сборка.

```bash
npm run lint
```

Проверка проекта ESLint.

```bash
npm test
```

Запуск тестов Vitest в watch-режиме.

```bash
npx vitest run
```

Однократный запуск всех тестов без watch-режима.

```bash
npm run preview
```

Предпросмотр production-сборки.

## Mock data

Начальные данные находятся в:

```text
db.json
```

JSON Server использует этот файл как Mock-базу данных.

## API

Основной ресурс:

```text
GET    /dishes
GET    /dishes/:id
POST   /dishes
PATCH  /dishes/:id
DELETE /dishes/:id
```

API-слой находится в:

```text
src/api/dishes.ts
```

## Примечание

Изображения блюд в демонстрационных данных используют внешние URL.

Проект создан как тестовое frontend-задание с акцентом на понятную структуру, типизацию, разделение ответственности и обработку пользовательских и API-состояний.
