import "./globals.css";
import { Providers } from "../components/Providers";
import { Navbar } from "../components/Navbar";
import { CartProvider } from "../components/CartContext";

export const metadata = {
  title: "Áo Shop - Mua Sắm Dễ Dàng",
  description: "Cửa hàng bán áo đẹp, chất lượng cao",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <CartProvider>
            <Navbar />
            <main className="container main-content">
              {children}
            </main>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
