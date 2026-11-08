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
        </body>
    </html>
  );
}