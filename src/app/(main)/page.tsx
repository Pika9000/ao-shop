'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './style.css';

import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Import Component khung sản phẩm đã tách riêng
// (Nếu dự án báo lỗi đường dẫn '@/', em đổi thành '../components/ProductSection')
import ProductSection from '@/components/ProductSection';
import { Product } from '@/components/ProductCard';

// 1. DỮ LIỆU MÃ KHUYẾN MÃI
const VOUCHERS = [
  {
    id: '100k',
    code: 'LUMEN100K',
    title: 'Giảm 100k',
    condition: 'Cho đơn hàng tối thiểu 1,000k',
    expiry: '01/01/2027',
    validFrom: '02/11/2026 - 01/01/2027',
  },
  {
    id: '200k',
    code: 'LUMEN200K',
    title: 'Giảm 200k',
    condition: 'Cho đơn hàng tối thiểu 2,000k',
    expiry: '01/01/2027',
    validFrom: '02/11/2026 - 01/01/2027',
  },
  {
    id: '300k',
    code: 'LUMEN300K',
    title: 'Giảm 300k',
    condition: 'Cho đơn hàng tối thiểu 3,000k',
    expiry: '01/01/2027',
    validFrom: '02/11/2026 - 01/01/2027',
  },
];

// 2. DỮ LIỆU KHU VỰC 1: HÀNG MỚI VỀ (Đầy đủ 8 sản phẩm)
const NEW_ARRIVALS: Product[] = [
  {
    id: 1,
    name: 'Áo khoác Denim nam wash bạc form rộng phong cách Streetwear',
    price: '399.000đ',
    image: '/images/san-pham-1.png',
    badge: 'new',
  },
  {
    id: 2,
    name: 'Áo sơ mi đũi nam màu trắng kem tay dài form Relaxed',
    price: '299.000đ',
    image: '/images/san-pham-2.png',
    badge: 'new',
  },
  {
    id: 3,
    name: 'Áo sơ mi nam xanh pastel tay dài form Oversize Hàn Quốc',
    price: '199.000đ',
    image: '/images/san-pham-3.png',
    badge: 'new',
  },
  {
    id: 4,
    name: 'Áo khoác gió nam cổ đứng màu xanh Navy tối giản',
    price: '299.000đ',
    image: '/images/san-pham-4.png',
    badge: 'new',
  },
  {
    id: 5,
    name: 'Áo khoác kaki nam cổ bẻ màu đen dáng Boxy tối giản',
    price: '299.000đ',
    image: '/images/san-pham-5.png',
    badge: 'new',
  },
  {
    id: 6,
    name: 'Áo khoác Barn Jacket nam cổ phối nâu phong cách Vintage',
    price: '199.000đ',
    image: '/images/san-pham-6.png',
    badge: 'new',
  },
  {
    id: 7,
    name: 'Áo khoác nỉ Track Jacket nam phối sọc tay phong cách Retro',
    price: '399.000đ',
    image: '/images/san-pham-7.png',
    badge: 'new',
  },
  {
    id: 8,
    name: 'Áo thun nam tay dài màu trắng trơn chất Cotton dày dặn',
    price: '199.000đ',
    image: '/images/san-pham-8.png',
    badge: 'new',
  },
];

// 3. DỮ LIỆU KHU VỰC 2: BÁN CHẠY NHẤT (4 sản phẩm tiêu biểu cho 1 hàng ngang)
const BEST_SELLERS: Product[] = [
  {
    id: 101,
    name: 'Áo khoác kaki nam cổ bẻ màu đen dáng Boxy tối giản',
    price: '299.000đ',
    image: '/images/san-pham-5.png',
    badge: 'hot',
  },
  {
    id: 102,
    name: 'Áo khoác Barn Jacket nam cổ phối nâu phong cách Vintage',
    price: '199.000đ',
    image: '/images/san-pham-6.png',
    badge: 'hot',
  },
  {
    id: 103,
    name: 'Áo khoác Denim nam wash bạc form rộng phong cách Streetwear',
    price: '399.000đ',
    image: '/images/san-pham-1.png',
    badge: 'hot',
  },
  {
    id: 104,
    name: 'Áo sơ mi nam xanh pastel tay dài form Oversize Hàn Quốc',
    price: '199.000đ',
    image: '/images/san-pham-3.png',
    badge: 'hot',
  },
];

export default function Home() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const swiper = new Swiper('.mySwiper', {
      modules: [Pagination, Autoplay],
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
      },
      autoplay: {
        delay: 10000,
        disableOnInteraction: false,
      },
    });

    return () => {
      if (swiper) swiper.destroy();
    };
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
      {/* 1. ẢNH BANNER LỚN */}
      <div className="section-banner">
        <div className="swiper mySwiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <img src="/images/banner-0.png" alt="Banner khuyến mãi 1" />
            </div>
            <div className="swiper-slide">
              <img src="/images/banner-1.png" alt="Banner khuyến mãi 2" />
            </div>
            <div className="swiper-slide">
              <img src="/images/banner-2.png" alt="Banner khuyến mãi 3" />
            </div>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
      {/* KẾT THÚC BANNER LỚN */}

      {/* 2. MÃ KHUYẾN MÃI */}
      <div className="section-one">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="inner-header">Mã khuyến mãi</h2>
            </div>
          </div>

          <div className="row">
            {VOUCHERS.map((voucher) => (
              <div key={voucher.id} className="col-xl-4 col-lg-6 col-md-6">
                <div className="inner-wrap">
                  <div className="inner-left">
                    <img src="/images/box.png" alt="ảnh hộp quà" />
                  </div>
                  <div className="inner-right">
                    <div className="box-top">
                      <h4 className="header-box">{voucher.title}</h4>
                      <p className="desc">
                        {voucher.condition}
                        <br />
                        HSD: {voucher.expiry}
                      </p>
                    </div>
                    <div className="box-bot">
                      <Link
                        href="#"
                        className="link-voucher"
                        data-bs-toggle="modal"
                        data-bs-target={`#modal-${voucher.id}`}
                        onClick={(e) => e.preventDefault()}
                      >
                        Chi tiết
                      </Link>

                      <div
                        className="modal fade"
                        id={`modal-${voucher.id}`}
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex={-1}
                        aria-labelledby={`modalLabel-${voucher.id}`}
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1 className="modal-title fs-5" id={`modalLabel-${voucher.id}`}>
                                {voucher.title} ({voucher.code})
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              Áp dụng từ:
                              <br />
                              {voucher.validFrom}
                              <br />
                              {voucher.condition}
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Đóng
                              </button>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => handleCopyCode(voucher.code)}
                              >
                                {copiedCode === voucher.code ? 'Đã chép' : 'Sao chép'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleCopyCode(voucher.code)}
                      >
                        {copiedCode === voucher.code ? 'Đã chép' : 'Sao chép'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* KẾT THÚC MÃ KHUYẾN MÃI */}

      {/* 3. KHU VỰC HÀNG MỚI VỀ */}
      <ProductSection
        title="NEW ARRIVALS"
        subtitle="Hãy tạo nên phong cách riêng của bạn"
        products={NEW_ARRIVALS}
      />

      {/* 4. KHU VỰC BÁN CHẠY NHẤT (Tái sử dụng cùng Component) */}
      <ProductSection
        title="BEST SELLERS"
        subtitle="Những thiết kế được yêu thích nhất tuần qua"
        products={BEST_SELLERS}
      />
    </>
  );
}