import React from 'react';
import Link from 'next/link';
import './Nav.css';

export const Nav: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="row">
          <div className="col-12">
            <div className="inner-main">
              {/* Cụm bên trái: Logo */}
              <div className="inner-logo">
                <Link href="/">
                  <img 
                    src="/images/logo-5.png" 
                    alt="Logo Lumen" 
                  />
                </Link>
              </div>

              {/* Cụm ở giữa: Bỏ div bọc ngoài, dùng trực tiếp thẻ nav */}
              <nav className="inner-menu" aria-label="Điều hướng chính">
                <ul className="nav-list">
                  <li>
                    <Link href="/" className="menu-1">
                    Trang chủ
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="menu-2">
                    Sản phẩm
                    </Link>
                  </li>
                  <li>
                    <Link href="/category-sale" className="menu-3">
                    Sale
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="menu-4">
                    Giới thiệu
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Cụm bên phải: Các nút chức năng */}
              <div className="inner-icon">
                <div className="inner-wrap">
                  <Link href="/search" className="btn-search" aria-label="Tìm kiếm">
                    <i className="fi fi-rr-search"></i>
                  </Link> 

                  <Link href="/wishlist" aria-label="Danh sách yêu thích">
                    <i className="fi fi-rr-heart"></i>
                  </Link>

                  <Link href="/cart" aria-label="Giỏ hàng">
                    <i className="fi fi-rr-shopping-bag"></i>
                  </Link>

                  <Link href="/login" aria-label="Tài khoản">
                    <i className="fi fi-rr-circle-user"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;