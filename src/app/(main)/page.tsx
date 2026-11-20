<<<<<<< HEAD
"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ảnh banner lớn */}
      <div className="banner">
        <img
          src="/images/mau-4.png"
          alt="ảnh banner"
          className="image-banner"
        />
      </div>

      {/* title */}
      <div className="inner-container">
        <div className="inner-wrap">
          <div className="inner-layout">
            <p className="inner-title-1">THỜI TRANG ĐỊNH HÌNH THỜI ĐẠI</p>
            <p className="inner-dec">Hãy tạo nên thời trang của riêng bạn</p>
          </div>
        </div>
      </div>
    </>
  );
}
=======
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import './style.css';

import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

export default function Home() {

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

  return (
    <>
      {/* ẢNH BANNER LỚN */}
      <div className="section-banner">
        <div className="swiper mySwiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <img src="/images/banner-0.png" />
            </div>
            <div className="swiper-slide">
              <img src="/images/banner-1.png" />
            </div>
            <div className="swiper-slide">
              <img src="/images/banner-2.png" />
            </div>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
      {/* KẾT THÚC BANNER LỚN */}

      {/* mã khuyến mãi */}
      <div className="section-one">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="inner-header">
                Mã khuyến mãi
              </h2>
            </div>
          </div>
          <div className="row">
            {/* VOUCHER 100K */}
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="inner-wrap ">
                <div className="inner-left">
                  <img src="/images/box.png" alt="ảnh hộp quà" />
                </div>
                <div className="inner-right">
                  <div className="box-top">
                    <h4 className="header-box">
                      Giảm 100k
                    </h4>
                    <p className="desc">
                      Cho đơn hàng tối thiểu 1,000k
                      <br/>
                      HSD: 01/01/2027
                    </p>
                  </div>
                  <div className="box-bot">
                    <Link
                      href="#"
                      className="link-voucher"
                      data-bs-toggle="modal"
                      data-bs-target="#modal100k"
                    >
                      Chi tiết
                    </Link>

                    <div
                      className="modal fade"
                      id="modal100k"
                      data-bs-backdrop="static"
                      data-bs-keyboard="false"
                      tabIndex={-1}
                      aria-labelledby="modal100kLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1 className="modal-title fs-5" id="modal100kLabel">
                              Giảm giá 100k
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            Áp dụng từ
                            <br />
                            02/11/2026 - 01/01/2027
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Đóng
                            </button>
                            <button type="button" className="btn btn-primary">
                              Sao chép
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button type="button" className="btn btn-primary">
                      Sao chép
                    </button>
              
                  </div>
                </div>
              </div>
            </div>

            {/* VOUCHER 200K */}
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="inner-wrap">
                <div className="inner-left">
                  <img src="/images/box.png" alt="ảnh hộp quà" />
                </div>                
                <div className="inner-right">
                  <div className="box-top">
                    <h4 className="header-box">
                      Giảm 200k
                    </h4>
                    <p className="desc">
                      Cho đơn hàng tối thiểu 2,000k
                      <br/>
                      HSD: 01/01/2027
                    </p>
                  </div>
                  <div className="box-bot" >
                    <Link
                      href="#"
                      className="link-voucher"
                      data-bs-toggle="modal"
                      data-bs-target="#modal200k"
                    >
                      Chi tiết
                    </Link>

                    <div
                      className="modal fade"
                      id="modal200k"
                      data-bs-backdrop="static"
                      data-bs-keyboard="false"
                      tabIndex={-1}
                      aria-labelledby="modal200kLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1 className="modal-title fs-5" id="modal200kLabel">
                              Giảm giá 200k
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            Áp dụng từ
                            <br />
                            02/11/2026 - 01/01/2027
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Đóng
                            </button>
                            <button type="button" className="btn btn-primary">
                              Sao chép
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button type="button" className="btn btn-primary">
                      Sao chép
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* VOUCHER 300K */}
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="inner-wrap">
                <div className="inner-left">
                  <img src="/images/box.png" alt="ảnh hộp quà" />
                </div>                
                <div className="inner-right">
                  <div className="box-top">
                    <h4 className="header-box">
                      Giảm 300k
                    </h4>
                    <p className="desc">
                      Cho đơn hàng tối thiểu 3,000k
                      <br/>
                      HSD: 01/01/2027
                    </p>
                  </div>
                  <div className="box-bot">
                    <Link
                      href="#"
                      className="link-voucher"
                      data-bs-toggle="modal"
                      data-bs-target="#modal300k"
                    >
                      Chi tiết
                    </Link>

                    <div
                      className="modal fade"
                      id="modal300k"
                      data-bs-backdrop="static"
                      data-bs-keyboard="false"
                      tabIndex={-1}
                      aria-labelledby="modal300kLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1 className="modal-title fs-5" id="modal300kLabel">
                              Giảm giá 300k
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            Áp dụng từ
                            <br />
                            02/11/2026 - 01/01/2027
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Đóng
                            </button>
                            <button type="button" className="btn btn-primary">
                              Sao chép
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button type="button" className="btn btn-primary">
                      Sao chép
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* kết thúc mã khuyến mãi */}


  {/* Sản phẩm mới */}
    
    <div className="section-two">
      <div className="container container-2">
        {/* Hàng 1: Tiêu đề */}
        <div className="row">
          <div className="col-12">
            <div className="inner-header-2">
              <h2 className="inner-title-2">
                Sản phẩm mới
              </h2>
              <p className="inner-desc-2">
                Hãy tạo nên phong cách riêng của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Hàng 2: Danh sách sản phẩm (CHỈ DÙNG 1 THẺ ROW BỌC TẤT CẢ CÁC CỘT) */}
        <div className="row">
          {/* Sản phẩm 1 */}
          <div className="col-xl-3 col-lg-4 col-md-6 col-12">
            <div className="container-box">
              <div className="inner-wrap">
                <div className="inner-top">
                  <img src="/images/mau-1.png" alt="áo polo" />
                  <i className="fi fi-rr-heart"></i>
                  <div className="container-tab">
                    <div className="tab-new">
                      new
                    </div>
                  </div>
                </div>
                <div className="inner-bot">
                  <div className="inner-title">Áo polo phong cách</div>
                  <div className="inner-price">799.000đ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sản phẩm 2 */}
          <div className="col-xl-3 col-lg-4 col-md-6 col-12">
            <div className="container-box">
              <div className="inner-wrap">
                <div className="inner-top">
                  <img src="/images/mau-1.png" alt="áo polo" />
                  <i className="fi fi-rr-heart"></i>
                  <div className="container-tab">
                    <div className="tab-new">
                      new
                    </div>
                  </div>
                </div>
                <div className="inner-bot">
                  <div className="inner-title">Áo polo phong cách</div>
                  <div className="inner-price">799.000đ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sản phẩm 3 */}
          <div className="col-xl-3 col-lg-4 col-md-6 col-12">
            <div className="container-box">
              <div className="inner-wrap">
                <div className="inner-top">
                  <img src="/images/mau-1.png" alt="áo polo" />
                  <i className="fi fi-rr-heart"></i>
                  <div className="container-tab">
                    <div className="tab-new">
                      new
                    </div>
                  </div>
                </div>
                <div className="inner-bot">
                  <div className="inner-title">Áo polo phong cách</div>
                  <div className="inner-price">799.000đ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sản phẩm 4 */}
          <div className="col-xl-3 col-lg-4 col-md-6 col-12">
            <div className="container-box">
              <div className="inner-wrap">
                <div className="inner-top">
                  <img src="/images/mau-1.png" alt="áo polo" />
                  <i className="fi fi-rr-heart"></i>
                  <div className="container-tab">
                    <div className="tab-new">
                      new
                    </div>
                  </div>
                </div>
                <div className="inner-bot">
                  <div className="inner-title">Áo polo phong cách</div>
                  <div className="inner-price">799.000đ</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-4 col-md-6 col-12">
            <div className="container-box">
              <div className="inner-wrap">
                <div className="inner-top">
                  <img src="/images/mau-1.png" alt="áo polo" />
                  <i className="fi fi-rr-heart"></i>
                  <div className="container-tab">
                    <div className="tab-new">
                      new
                    </div>
                  </div>
                </div>
                <div className="inner-bot">
                  <div className="inner-title">Áo polo phong cách</div>
                  <div className="inner-price">799.000đ</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-4 col-md-6 col-12">
            <div className="container-box">
              <div className="inner-wrap">
                <div className="inner-top">
                  <img src="/images/mau-1.png" alt="áo polo" />
                  <i className="fi fi-rr-heart"></i>
                  <div className="container-tab">
                    <div className="tab-new">
                      new
                    </div>
                  </div>
                </div>
                <div className="inner-bot">
                  <div className="inner-title">Áo polo phong cách</div>
                  <div className="inner-price">799.000đ</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-4 col-md-6 col-12">
            <div className="container-box">
              <div className="inner-wrap">
                <div className="inner-top">
                  <img src="/images/mau-1.png" alt="áo polo" />
                  <i className="fi fi-rr-heart"></i>
                  <div className="container-tab">
                    <div className="tab-new">
                      new
                    </div>
                  </div>
                </div>
                <div className="inner-bot">
                  <div className="inner-title">Áo polo phong cách</div>
                  <div className="inner-price">799.000đ</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-4 col-md-6 col-12">
            <div className="container-box">
              <div className="inner-wrap">
                <div className="inner-top">
                  <img src="/images/mau-1.png" alt="áo polo" />
                  <i className="fi fi-rr-heart"></i>
                  <div className="container-tab">
                    <div className="tab-new">
                      new
                    </div>
                  </div>
                </div>
                <div className="inner-bot">
                  <div className="inner-title">Áo polo phong cách</div>
                  <div className="inner-price">799.000đ</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  {/* Kết thúc sản phẩm mới */}
    </>
  );
}
>>>>>>> 42f8b71c5f43dfe6b315bf884d21f14968387e5c
