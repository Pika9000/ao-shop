import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../data/mockData';
import './ProductSection.css';


interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export default function ProductSection({
  title,
  subtitle,
  products,
}: ProductSectionProps) {
  return (
    <div className="section-two">
      <div className="container container-2">
        {/* Phần tiêu đề động theo props */}
        <div className="row">
          <div className="col-12">
            <div className="inner-header-2">
              <h2 className="inner-title-2">{title}</h2>
              {subtitle && <p className="inner-desc-2">{subtitle}</p>}
            </div>
          </div>
        </div>

        {/* Phần lưới sản phẩm tự động lặp theo mảng products */}
        <div className="row">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}