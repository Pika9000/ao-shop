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

    {/* thông tin mã khuyến mãi */}

  {/* kết thúc mã khuyến mãi */}
    </>
  );
}