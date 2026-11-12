// File CSS chứa toàn bộ style cho Modal, Button, Grid...
import 'bootstrap/dist/css/bootstrap.min.css';
import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'LUMEN',
  description: 'Cửa hàng áo thời trang Lumen',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        {children}

        {/* Tải Bootstrap JS qua CDN phía Client */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}