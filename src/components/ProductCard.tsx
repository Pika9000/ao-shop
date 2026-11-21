'use client';

import React, { useState } from 'react';

// Xuất (export) kiểu dữ liệu Product để các file khác dùng chung
export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  badge?: string; // Dùng linh hoạt: 'new', 'hot', '-20%', hoặc để trống
}

export default function ProductCard({ product }: { product: Product }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-12">
      <div className="container-box">
        <div className="inner-wrap">
          <div className="inner-top">
            <img src={product.image} alt={product.name} />

            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className={`btn-wishlist ${isLiked ? 'is-liked' : ''}`}
              aria-label="Yêu thích"
            >
              <i className={isLiked ? 'fi fi-sr-heart' : 'fi fi-rr-heart'}></i>
            </button>

            {/* Nếu sản phẩm có nhãn (badge) thì mới hiển thị */}
            {product.badge && (
              <div className="container-tab">
                <div className="tab-new">{product.badge}</div>
              </div>
            )}
          </div>

          <div className="inner-bot">
            <div className="inner-title">{product.name}</div>
            <div className="inner-price">{product.price}</div>
            <button type="button" className="btn-buy-now">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}