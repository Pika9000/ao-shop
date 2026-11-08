'use client';

import React from 'react';

export default function CartPage() {
  return (
    <div className="shopping-cart">
      <h4>GIỎ HÀNG</h4>
      <h6>10 sản phẩm</h6>

      <label>
        <input type="checkbox" className="btn-all" />
        Tất cả sản phẩm
      </label>
      <h6>Xóa tất cả</h6>

      <div className="item-cart">
        <label>
          <input type="checkbox" />
          Sản phẩm
        </label>
      </div>
    </div>
  );
}