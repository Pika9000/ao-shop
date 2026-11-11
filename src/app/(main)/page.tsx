'use client';

import React from 'react';
import Link from 'next/link';
import './style.css';

export default function Home() {
  return (
    <>
      {/* ảnh banner lớn */}
      <div className="banner">
        <img src="/images/mau-4.png" alt="ảnh banner" className="image-banner"/>
      </div>

      {/* title */}
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
            <div className="col-xl-4">
              <div className="inner-wrap">
                <img src="/images/box.png" className="inner-left" alt="ảnh hộp quà" />
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
                    <Link href="#" className="link-voucher">
                      Chi tiết
                    </Link>
                    <button type="button" className="btn btn-primary">
                      Sao chép
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="inner-wrap">
                <img src="/images/box.png" className="inner-left" alt="ảnh hộp quà" />
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
                    <Link href="#" className="link-voucher">
                      Chi tiết
                    </Link>
                    <button type="button" className="btn btn-primary">
                      Sao chép
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="inner-wrap">
                <img src="/images/box.png" className="inner-left" alt="ảnh hộp quà" />
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
                    <Link href="#" className="link-voucher">
                      Chi tiết
                    </Link>
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
    </>
  );
}