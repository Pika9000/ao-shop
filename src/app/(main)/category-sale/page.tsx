<<<<<<< HEAD
"use client";

import React from "react";
=======
'use client';

import React from 'react';

>>>>>>> 42f8b71c5f43dfe6b315bf884d21f14968387e5c

export default function CategoryPage() {
  return (
    <>
<<<<<<< HEAD
      {/* ảnh banner lớn */}
      <div className="banner">
        <img src="#" alt="ảnh banner" />
      </div>

      {/* Thanh breadcrumb nhỏ */}
      <div>
        <span>Trang chủ</span>
      </div>
=======

      {/* ảnh banner lớn */}
      <div className="banner"><img src="#" alt="ảnh banner" /></div>

      {/* Thanh breadcrumb nhỏ */}
      <div><span>Trang chủ</span></div>
>>>>>>> 42f8b71c5f43dfe6b315bf884d21f14968387e5c

      {/* Main */}
      <div className="main-layout">
        <div className="left-layout">
          <h6>LOẠI SẢN PHẨM</h6>
<<<<<<< HEAD
          <input
            type="text"
            id="search-item"
            name="search-item"
            placeholder="Tìm loại sản phẩm"
          />
=======
          <input type="text" id="search-item" name="search-item" placeholder="Tìm loại sản phẩm" />
>>>>>>> 42f8b71c5f43dfe6b315bf884d21f14968387e5c
        </div>

        {/* loại sản phẩm */}
        <ul className="list-item">
<<<<<<< HEAD
          <li>
            <label>
              <input type="checkbox" /> Áo polo trơn bo kẻ
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> áo polo Active
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Áo polo Len
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Áo polo họa tiết
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Áo polo can phối
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Áo polo coolmax
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Áo polo melang
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Áo polo kẻ
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Áo T shirt trơn
            </label>
          </li>
=======
          <li><label><input type="checkbox" /> Áo polo trơn bo kẻ</label></li>
          <li><label><input type="checkbox" /> áo polo Active</label></li>
          <li><label><input type="checkbox" /> Áo polo Len</label></li>
          <li><label><input type="checkbox" /> Áo polo họa tiết</label></li>
          <li><label><input type="checkbox" /> Áo polo can phối</label></li>
          <li><label><input type="checkbox" /> Áo polo coolmax</label></li>
          <li><label><input type="checkbox" /> Áo polo melang</label></li>
          <li><label><input type="checkbox" /> Áo polo kẻ</label></li>
          <li><label><input type="checkbox" /> Áo T shirt trơn</label></li>
>>>>>>> 42f8b71c5f43dfe6b315bf884d21f14968387e5c
        </ul>

        {/* Kích cỡ của đồ */}
        <div className="size-selector">
          <h6>KÍCH CỠ</h6>
          <ul className="size-list">
<<<<<<< HEAD
            <li>
              <button type="button" className="btn-size">
                S
              </button>
            </li>
            <li>
              <button type="button" className="btn-size">
                M
              </button>
            </li>
            <li>
              <button type="button" className="btn-size">
                L
              </button>
            </li>
            <li>
              <button type="button" className="btn-size">
                XL
              </button>
            </li>
            <li>
              <button type="button" className="btn-size">
                XXL
              </button>
            </li>
=======
            <li><button type="button" className="btn-size">S</button></li>
            <li><button type="button" className="btn-size">M</button></li>
            <li><button type="button" className="btn-size">L</button></li>
            <li><button type="button" className="btn-size">XL</button></li>
            <li><button type="button" className="btn-size">XXL</button></li>
>>>>>>> 42f8b71c5f43dfe6b315bf884d21f14968387e5c
          </ul>
        </div>

        {/* bảng màu */}
        <div className="color-selector">
          <h6>MÀU SẮC</h6>
        </div>

        {/* khoảng giá */}
        <div className="price-selector">
          <h6>KHOẢNG GIÁ</h6>
          <ul className="price">
<<<<<<< HEAD
            <li>
              <label>
                <input type="checkbox" /> Dưới 500,000₫
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" /> 500,000₫ - 900,000₫
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" /> 900,000₫ - 1,400,000₫
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" /> Trên 1,400,000₫
              </label>
            </li>
=======
            <li><label><input type="checkbox" /> Dưới 500,000₫</label></li>
            <li><label><input type="checkbox" /> 500,000₫ - 900,000₫</label></li>
            <li><label><input type="checkbox" /> 900,000₫ - 1,400,000₫</label></li>
            <li><label><input type="checkbox" /> Trên 1,400,000₫</label></li>
>>>>>>> 42f8b71c5f43dfe6b315bf884d21f14968387e5c
          </ul>
        </div>

        <div className="right-layout">
          <div className="top">
            <h6>sản phẩm</h6>
            <div className="sort">
              <h6>Sắp xếp:</h6>
              <select name="sort" id="sort-select" defaultValue="Mới nhất">
                <option value="Mới nhất">Mới nhất</option>
                <option value="Giá thấp đến cao">Giá thấp đến cao</option>
                <option value="Giá cao đến thấp">Giá cao đến thấp</option>
                <option value="Bán chạy nhất">Bán chạy nhất</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 42f8b71c5f43dfe6b315bf884d21f14968387e5c
