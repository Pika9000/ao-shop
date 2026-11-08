'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <>

      {/* ảnh banner lớn */}
      <div className="banner">
        <img src="/images/mau-4.png" alt="ảnh banner" className="image-banner"/>
      </div>


      {/* title */}
      <div className="inner-container">
        <div className="inner-wrap">
          <div className="inner-layout">
            <p className="inner-title-1">
              THỜI TRANG ĐỊNH HÌNH THỜI ĐẠI
            </p>
            <p className="inner-dec">
              Hãy tạo nên thời trang của riêng bạn
            </p>
          </div>
        </div>
      </div>
    </>
  );
}