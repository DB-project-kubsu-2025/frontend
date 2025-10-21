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

# Api
## Авторизация

**POST** `/api/login`  
Авторизация пользователя по логину и паролю

**Request:**
```json
{
  "login": "admin",
  "password": "123456"
}
```

**Response 200:**
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

**Response 400:**
```json
{
  "message": "Неверный логин или пароль",
}
```

## Данные авторизованного пользователя

**GET** `/api/me`  
Получение данных авторизованного пользователя

**Response 200:**
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

**Response 400:**
```json
{
  "authenticated": false,
}
```

## Отпуска

**GET** `/api/vacations`  

**Request:**
```json
{
  "year": 2025
}
```

**Response 200:**
```json
{
  "used_days": 21,
  "balance_days": 9,
  "planned_days": 2,
  "calendarLeaves": [
    {
      "id": 1,
      "employee": "Иванов Иван",
      "start_date": "2025-07-01",
      "end_date": "2025-07-14",
      "status": "done",
    },
    {
      "id": 2,
      "employee": "Петров Петр",
      "start_date": "2025-08-10",
      "end_date": "2025-08-20",
      "status": "planned",
    },
    {
      "id": 3,
      "employee": "Сидоров Сергей",
      "start_date": "2025-09-05",
      "end_date": "2025-09-12",
      "status": "planned",
    },
  ],
}
```

**Response 400:**
```json
{
  "authenticated": false,
}
```