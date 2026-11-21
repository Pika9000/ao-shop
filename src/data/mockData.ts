// 1. KHAI BÁO KIỂU DỮ LIỆU (INTERFACE)
export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  badge?: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  condition: string;
  expiry: string;
  validFrom: string;
}

// 2. DỮ LIỆU MÃ KHUYẾN MÃI
export const VOUCHERS: Voucher[] = [
  {
    id: '100k',
    code: 'LUMEN100K',
    title: 'Giảm 100k',
    condition: 'Cho đơn hàng tối thiểu 1,000k',
    expiry: '01/01/2027',
    validFrom: '02/11/2026 - 01/01/2027',
  },
  {
    id: '200k',
    code: 'LUMEN200K',
    title: 'Giảm 200k',
    condition: 'Cho đơn hàng tối thiểu 2,000k',
    expiry: '01/01/2027',
    validFrom: '02/11/2026 - 01/01/2027',
  },
  {
    id: '300k',
    code: 'LUMEN300K',
    title: 'Giảm 300k',
    condition: 'Cho đơn hàng tối thiểu 3,000k',
    expiry: '01/01/2027',
    validFrom: '02/11/2026 - 01/01/2027',
  },
];

// 3. DỮ LIỆU KHU VỰC 1: HÀNG MỚI VỀ (8 sản phẩm)
export const NEW_ARRIVALS: Product[] = [
  {
    id: 1,
    name: 'Áo khoác Denim nam wash bạc form rộng phong cách Streetwear',
    price: '399.000đ',
    image: '/images/san-pham-1.png',
    badge: 'new',
  },
  {
    id: 2,
    name: 'Áo sơ mi đũi nam màu trắng kem tay dài form Relaxed',
    price: '299.000đ',
    image: '/images/san-pham-2.png',
    badge: 'new',
  },
  {
    id: 3,
    name: 'Áo sơ mi nam xanh pastel tay dài form Oversize Hàn Quốc',
    price: '199.000đ',
    image: '/images/san-pham-3.png',
    badge: 'new',
  },
  {
    id: 4,
    name: 'Áo khoác gió nam cổ đứng màu xanh Navy tối giản',
    price: '299.000đ',
    image: '/images/san-pham-4.png',
    badge: 'new',
  },
  {
    id: 5,
    name: 'Áo khoác kaki nam cổ bẻ màu đen dáng Boxy tối giản',
    price: '299.000đ',
    image: '/images/san-pham-5.png',
    badge: 'new',
  },
  {
    id: 6,
    name: 'Áo khoác Barn Jacket nam cổ phối nâu phong cách Vintage',
    price: '199.000đ',
    image: '/images/san-pham-6.png',
    badge: 'new',
  },
  {
    id: 7,
    name: 'Áo khoác nỉ Track Jacket nam phối sọc tay phong cách Retro',
    price: '399.000đ',
    image: '/images/san-pham-7.png',
    badge: 'new',
  },
  {
    id: 8,
    name: 'Áo thun nam tay dài màu trắng trơn chất Cotton dày dặn',
    price: '199.000đ',
    image: '/images/san-pham-8.png',
    badge: 'new',
  },
];

// 4. DỮ LIỆU KHU VỰC 2: BÁN CHẠY NHẤT (8 sản phẩm)
export const BEST_SELLERS: Product[] = [
  {
    id: 101,
    name: 'Áo khoác kaki nam cổ bẻ màu đen dáng Boxy tối giản',
    price: '299.000đ',
    image: '/images/san-pham-5.png',
    badge: 'best seller',
  },
  {
    id: 102,
    name: 'Áo khoác Barn Jacket nam cổ phối nâu phong cách Vintage',
    price: '199.000đ',
    image: '/images/san-pham-6.png',
    badge: 'best seller',
  },
  {
    id: 103,
    name: 'Áo khoác Denim nam wash bạc form rộng phong cách Streetwear',
    price: '399.000đ',
    image: '/images/san-pham-1.png',
    badge: 'best seller',
  },
  {
    id: 104,
    name: 'Áo sơ mi nam xanh pastel tay dài form Oversize Hàn Quốc',
    price: '199.000đ',
    image: '/images/san-pham-3.png',
    badge: 'best seller',
  },
  {
    id: 105,
    name: 'Áo sơ mi đũi nam màu trắng kem tay dài form Relaxed',
    price: '299.000đ',
    image: '/images/san-pham-2.png',
    badge: 'best seller',
  },
  {
    id: 106,
    name: 'Áo khoác gió nam cổ đứng màu xanh Navy tối giản',
    price: '299.000đ',
    image: '/images/san-pham-4.png',
    badge: 'best seller',
  },
  {
    id: 107,
    name: 'Áo khoác nỉ Track Jacket nam phối sọc tay phong cách Retro',
    price: '399.000đ',
    image: '/images/san-pham-7.png',
    badge: 'best seller',
  },
  {
    id: 108,
    name: 'Áo thun nam tay dài màu trắng trơn chất Cotton dày dặn',
    price: '199.000đ',
    image: '/images/san-pham-8.png',
    badge: 'best seller',
  },
];

// 5. DỮ LIỆU KHU VỰC 3: SẢN PHẨM GIẢM GIÁ (8 sản phẩm)
export const SALE_PRODUCTS: Product[] = [
  {
    id: 201,
    name: 'Áo khoác kaki nam cổ bẻ màu đen dáng Boxy tối giản',
    price: '299.000đ',
    image: '/images/san-pham-5.png',
    badge: 'sale',
  },
  {
    id: 202,
    name: 'Áo khoác Barn Jacket nam cổ phối nâu phong cách Vintage',
    price: '199.000đ',
    image: '/images/san-pham-6.png',
    badge: 'sale',
  },
  {
    id: 203,
    name: 'Áo khoác Denim nam wash bạc form rộng phong cách Streetwear',
    price: '399.000đ',
    image: '/images/san-pham-1.png',
    badge: 'sale',
  },
  {
    id: 204,
    name: 'Áo sơ mi nam xanh pastel tay dài form Oversize Hàn Quốc',
    price: '199.000đ',
    image: '/images/san-pham-3.png',
    badge: 'sale',
  },
  {
    id: 205,
    name: 'Áo sơ mi đũi nam màu trắng kem tay dài form Relaxed',
    price: '299.000đ',
    image: '/images/san-pham-2.png',
    badge: 'sale',
  },
  {
    id: 206,
    name: 'Áo khoác gió nam cổ đứng màu xanh Navy tối giản',
    price: '299.000đ',
    image: '/images/san-pham-4.png',
    badge: 'sale',
  },
  {
    id: 207,
    name: 'Áo khoác nỉ Track Jacket nam phối sọc tay phong cách Retro',
    price: '399.000đ',
    image: '/images/san-pham-7.png',
    badge: 'sale',
  },
  {
    id: 208,
    name: 'Áo thun nam tay dài màu trắng trơn chất Cotton dày dặn',
    price: '199.000đ',
    image: '/images/san-pham-8.png',
    badge: 'sale',
  },
];