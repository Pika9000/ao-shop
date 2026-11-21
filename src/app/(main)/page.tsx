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
import { VOUCHERS, NEW_ARRIVALS, BEST_SELLERS, SALE_PRODUCTS } from '@/data/mockData';

// 1. DỮ LIỆU MÃ KHUYẾN MÃI


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
              <h2 className="inner-header">VOUCHER</h2>
            </div>
          </div>

          <div className="row">
            {VOUCHERS.map((voucher) => (
              <div key={voucher.id} className="col-xl-4 col-lg-6 col-md-6">
                <div className="inner-wrap">
                  <div className="inner-left">
                    <img src="/images/box-1.png" alt="ảnh hộp quà" />
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

      {/* Ảnh banner-2 */}

      <div className="section-three">
        <div className="container">
          <div className="inner-wrap">
            <Link href="#">
              <img src="/images/banner-1.png" alt="Ảnh banner"/>
            </Link>
          </div>
        </div>
      </div>

      {/*Kết thúc Ảnh banner-2 */}


      {/*  KHU VỰC BÁN CHẠY NHẤT  */}
      <ProductSection
        title="BEST SELLERS"
        subtitle="Những thiết kế được yêu thích nhất tuần qua"
        products={BEST_SELLERS}
      />

      {/* Kết thúc KHU VỰC BÁN CHẠY NHẤT */}


      {/* Ảnh banner-3 */}
      <div className="section-three">
        <div className="container">
          <div className="inner-wrap">
            <Link href="#">
              <img src="/images/banner-0.png" alt="Ảnh banner"/>
            </Link>
          </div>
        </div>
      </div>

      {/*Kết thúc Ảnh banner-3 */}


      {/*  KHU VỰC Sale   */}
      <ProductSection
        title="SALE"
        subtitle="Những thiết kế được SALE"
        products={SALE_PRODUCTS}
      />

      {/* Kết thúc KHU VỰC Sale */}


            

    </>
  );
}