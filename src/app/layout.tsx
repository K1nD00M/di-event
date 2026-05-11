import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dialife Event — Ивент-агентство в Санкт-Петербурге',
  description: 'Организуем корпоративы, свадьбы, детские праздники и другие мероприятия в Санкт-Петербурге. Без скрытых комиссий.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
