This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# API

---

## АВТОРИЗАЦИЯ

### POST `/api/auth`

#### Request Body

```json
{
  "login": "admin",
  "password": "123456"
}
```

#### Response 200

```json
{
  "message": "Авторизация успешна",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": 1,
    "name": "Иванов Иван",
    "role": "admin"
  }
}
```

#### Response 400

```json
{
  "message": "Неверный логин или пароль"
}
```

---

## Данные авторизованного пользователя

### GET `/api/auth/me`

#### Response 200

```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "name": "Иванов Иван",
    "role": "admin"
  }
}
```

#### Response 400

```json
{
  "authenticated": false
}
```

---

## Отпуска

### GET `/api/vacations?year={year}`

Получение информации об отпусках всех сотрудников за выбранный год

#### Параметры (URL)

| Имя    | Тип | Обязательное | Описание                    |
| ------ | --- | ------------ | --------------------------- |
| `year` | int | да           | год, по которому идёт поиск |

#### Response 200

```json
{
  "events": [
    {
      "id": 1,
      "employee_id": 1,
      "title": "отпуск 1 Сотрудник ГК",
      "date": "2025-11-01",
      "color": "#aa0000"
    },
    {
      "id": "2",
      "employee_id": 3,
      "title": "отпуск 1 Товаровед",
      "date": "2025-11-02"
    },
    {
      "id": "6",
      "employee_id": 2,
      "title": "Директор магазина",
      "start": "2025-11-01",
      "end": "2025-11-04" //с 01.11 до 03.11 включительно
    }
  ],
  "employees": [
    { "id": 1, "name": "Сотрудник ГК" },
    { "id": 2, "name": "Директор магазина" },
    { "id": 3, "name": "Товаровед" },
    { "id": 4, "name": "Кладовщик" },
    { "id": 5, "name": "Продавец" }
  ]
}
```

**Response 400:**

```json
{
  "message": "Некорректные данные"
}
```

---

## МОИ ОТПУСКА

### GET `/api/vacations/my?year={year}`

Получение информации о моих отпусках за выбранный год

#### Параметры (URL)

| Имя    | Тип | Обязательное | Описание                    |
| ------ | --- | ------------ | --------------------------- |
| `year` | int | да           | год, по которому идёт поиск |

#### Response 200

```json
{
  "used_days": 21,
  "balance_days": 9,
  "planned_days": 2,
  "calendarLeaves": [
    {
      "id": 1,
      "start_date": "2025-07-01",
      "end_date": "2025-07-14",
      "status": "done"
    },
    {
      "id": 2,
      "start_date": "2025-08-10",
      "end_date": "2025-08-20",
      "status": "planned"
    },
    {
      "id": 3,
      "start_date": "2025-09-05",
      "end_date": "2025-09-12",
      "status": "planned"
    }
  ]
}
```

#### Response 400

```json
{
  "message": "Отпуска не найдены"
}
```

---

## POST `/api/vacations/my`

Добавление моего отпуска

#### Request Body

```json
{
  "calendar": {
    "start_date": "2025-09-05",
    "end_date": "2025-09-12"
  }
}
```

#### Response 200

```json
{
  "message": "Отпуск добавлен"
}
```

#### Response 400

```json
{
  "message": "Некорректные данные"
}
```

---

## МОИ ОТПУСКА (ДЕТАЛЬНАЯ СТРАНИЦА)

### GET `/api/vacations/my/{id}?year={year}`

Получение информации о моём отпуске за выбранный год.

### Параметры

| Имя    | Тип | Обязательное | Описание                    |
| ------ | --- | ------------ | --------------------------- |
| `id`   | int | да           | Идентификатор записи        |
| `year` | int | да           | год, по которому идёт поиск |

#### Response 200

```json
{
  "number": 1232432,
  "calendar": {
    "id": 1,
    "start_date": "2025-07-01",
    "end_date": "2025-07-14",
    "status": "planned"
  }
}
```

#### Response 400

```json
{
  "message": "Отпуска не найдены"
}
```

---

## PUT `/api/vacations/my/{id}`

Обновление моего отпуска

### Параметры

| Имя  | Тип | Обязательное | Описание             |
| ---- | --- | ------------ | -------------------- |
| `id` | int | да           | Идентификатор записи |

#### Request Body

```json
{
  "calendar": {
    "id": 3,
    "start_date": "2025-09-05",
    "end_date": "2025-09-12"
  }
}
```

#### Response 200

```json
{
  "message": "Отпуск обновлён"
}
```

#### Response 400

```json
{
  "message": "Некорректные данные"
}
```

---

## DELETE `/api/vacations/my/{id}`

Удаление моего отпуска

### Параметры

| Имя  | Тип | Обязательное | Описание             |
| ---- | --- | ------------ | -------------------- |
| `id` | int | да           | Идентификатор записи |

#### Response 200

```json
{
  "message": "Отпуск удалён"
}
```

#### Response 400

```json
{
  "message": "Некорректные данные"
}
```
