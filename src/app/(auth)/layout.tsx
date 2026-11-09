// app/layout.tsx
import React from 'react';
import { Roboto, Playfair_Display } from 'next/font/google';
import './style-auth.css'; // File CSS toàn cục[cite: 2]

// 1. Khai báo Font Roboto (cho toàn trang)
const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-roboto', // Đặt tên biến CSS
  display: 'swap',
});

// 2. Khai báo Font Playfair Display (cho Tiêu đề/Heading)
const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair', // Đặt tên biến CSS
  display: 'swap',
});

export const metadata = {
  title: 'Lumen - Đăng nhập',
  description: 'Trang đăng nhập hệ thống Lumen',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${roboto.variable} ${playfair.variable}`} suppressHydrationWarning>
  <body>{children}</body>
    </html>
  );
}