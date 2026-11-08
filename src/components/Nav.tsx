import React from 'react';
import Link from 'next/link';
import "./style.css";

export const Nav: React.FC = () => {
  return (
    <div className="navigation">
      {/* Thanh thông báo */}
      <div className="nav-container">
        <div className="inner-bar">
          <div className="inner-marquee">
            <p className="inner-title">Freeship, đổi trả 30 ngày, đảm bảo chất lượng</p>
          </div>
        </div>
      </div>

      <header className="main-header">
        <div className="inner-wrap">
          <div className="main-top">
          {/* Cụm bên trái */}
            <div className="header-left">
              <button className="btn-menu" type="button">
                <img src="/images/menu-burger.svg" alt="Menu" className="icon-menu" />
              </button>

              <Link href="/" >
                <img src="/images/logo-5.png" className="logo-lumen"/>
              </Link>
            </div>

          {/* Cụm ở giữa */}
          <div className="header-between">
            <input
              type="text"
              id="search"
              name="search"
              placeholder="Bạn đang tìm gì..."
              className="search"
            />
            <button className="btn-search" type="button">
              <img src="/images/search.svg" alt="search" className="icon-search" />
            </button>
          </div>

          {/* Cụm bên phải */}
          <div className="header-right">
            <Link href="#" className="btn-store">
              <img src="/images/shop.png" alt="store" />
              <span>Cửa hàng</span>
            </Link>

            <Link href="/login" className="btn-user">
              <img src="/images/user.svg" alt="user" />
              <span>Tài khoản</span>
            </Link>

            <Link href="/cart" className="btn-cart">
              <img src="/images/shopping-cart.svg" alt="cart" />
              <span>Giỏ hàng</span>
            </Link>
          </div>
          </div>

          <div className="main-bot">
            <nav className="main-nav">
              <ul className="dieu-huong">
                <li><Link href="/">TRANG CHỦ</Link></li>
                <li><Link href="/">SẢN PHẨM MỚI</Link></li>
                <li><Link href="/best-selling-product">SẢN PHẨM BÁN CHẠY</Link></li>
                <li><Link href="/category-sale">DANH MỤC SALE</Link></li>
                <li><Link href="#">COMBO</Link></li>      
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Nav;