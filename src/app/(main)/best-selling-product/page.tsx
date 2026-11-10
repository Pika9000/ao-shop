"use client";

import React from "react";
import "./style.css";

export default function CategoryPage() {
  return (
    <>
      {/* ảnh banner lớn */}
      <div className="banner">
        <img src="#" alt="ảnh banner" />
      </div>

      {/* Thanh breadcrumb nhỏ */}
      <div>
        <span>Trang chủ</span>
      </div>

      {/* Main */}
      <div className="main-layout">
        <div className="left-layout">
          <h6>LOẠI SẢN PHẨM</h6>
          <input
            type="text"
            id="search-item"
            name="search-item"
            placeholder="Tìm loại sản phẩm"
          />
        </div>

        {/* loại sản phẩm */}
        <ul className="list-item">
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
        </ul>

        {/* Kích cỡ của đồ */}
        <div className="size-selector">
          <h6>KÍCH CỠ</h6>
          <ul className="size-list">
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
          </ul>
        </div>

        <div className="right-layout">
          <div className="top">
            <h6>100 sản phẩm</h6>
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

          <div className="betwen">
            <div className="box-1">
              <img src="/images/anh1.webp" className="img-box-1" />
            </div>
            <h6>box2</h6>
            <h6>box3</h6>
            <h6>box4</h6>
            <h6>box5</h6>
            <h6>box6</h6>
            <h6>box7</h6>
            <h6>box8</h6>
          </div>
        </div>
      </div>
    </>
  );
}
