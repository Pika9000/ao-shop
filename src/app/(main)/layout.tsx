import './style.css';
import Nav from '@/components/Nav';


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

        <Nav />
        {children}
        </body>
    </html>
  );
}