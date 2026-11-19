# TÀI LIỆU ĐẶC TẢ API CHUẨN (RESTful API SPECIFICATION)
Dự án: **Website Bán Quần Áo (Áo Shop)**  
Người phụ trách: **Thành viên C (Git, DevOps & BA)**  
Phiên bản: **v1.1** — Cập nhật theo Schema Prisma và bổ sung đặc tả thanh toán VietQR & MoMo.

---

## 1. QUY ƯỚC CHUNG (GENERAL CONVENTIONS)

### 1.1. Base URL
- **Môi trường Development:** `http://localhost:3000/api`
- **Môi trường Production:** `https://your-domain.com/api`

### 1.2. Định dạng trao đổi dữ liệu
- Tất cả request body phải có header: `Content-Type: application/json`.
- Định dạng dữ liệu: **JSON** UTF-8.

### 1.3. Cấu trúc Response chuẩn toàn hệ thống (Standard Envelope)

#### Khi THÀNH CÔNG (HTTP Status `200`, `201`):
```json
{
  "success": true,
  "message": "Mô tả kết quả thao tác thành công",
  "data": {
    // Dữ liệu trả về (Object hoặc Array)
  }
}
```

#### Khi THẤT BẠI (HTTP Status `400`, `401`, `403`, `404`, `500`):
```json
{
  "success": false,
  "error": "Mô tả nguyên nhân lỗi rõ ràng",
  "code": "MA_LOI_HE_THONG"
}
```

### 1.4. Bảng mã trạng thái HTTP (HTTP Status Codes)
| Mã HTTP | Tên | Ý nghĩa |
| :--- | :--- | :--- |
| `200` | OK | Xử lý thành công (GET, PUT, PATCH, DELETE) |
| `201` | Created | Tạo mới tài nguyên thành công (POST) |
| `400` | Bad Request | Dữ liệu gửi lên sai định dạng hoặc thiếu trường bắt buộc |
| `401` | Unauthorized | Chưa đăng nhập hoặc phiên làm việc đã hết hạn |
| `403` | Forbidden | Không có quyền truy cập (vd: khách hàng đòi vào trang admin) |
| `404` | Not Found | Không tìm thấy tài nguyên (không thấy sản phẩm, đơn hàng) |
| `409` | Conflict | Trùng dữ liệu duy nhất (email, sku) |
| `500` | Internal Server Error | Lỗi sập server hoặc lỗi truy vấn Database |

---

## 2. DANH SÁCH ENDPOINTS CHI TIẾT

---

### PHẦN I: DANH MỤC & SẢN PHẨM (CATALOG & PRODUCTS)

#### 1. Lấy danh sách danh mục
- **Endpoint:** `GET /categories`
- **Quyền:** Public (Ai cũng xem được)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "cat_1",
        "name": "Áo Thun",
        "slug": "ao-thun"
      },
      {
        "id": "cat_2",
        "name": "Áo Sơ Mi",
        "slug": "ao-so-mi"
      }
    ]
  }
  ```

---

#### 2. Lấy danh sách sản phẩm (Có phân trang & lọc)
- **Endpoint:** `GET /products`
- **Quyền:** Public
- **Query Parameters:**
  - `page` (number, default: 1): Trang hiện tại
  - `limit` (number, default: 12): Số lượng sản phẩm / trang
  - `category` (string, optional): Lọc theo `slug` danh mục
  - `search` (string, optional): Tìm kiếm theo tên áo
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "prod_1",
          "name": "Áo Polo Nam Classic",
          "price": 250000,
          "imageUrl": "https://example.com/polo.jpg",
          "category": {
            "name": "Áo Polo",
            "slug": "ao-polo"
          }
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 12,
        "totalItems": 45,
        "totalPages": 4
      }
    }
  }
  ```

---

#### 3. Lấy chi tiết sản phẩm & các biến thể (Size/Màu)
- **Endpoint:** `GET /products/:id`
- **Quyền:** Public
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "id": "prod_1",
      "name": "Áo Polo Nam Classic",
      "description": "Chất liệu cotton 100% thoáng mát, thấm hút mồ hôi.",
      "price": 250000,
      "imageUrl": "https://example.com/polo.jpg",
      "variants": [
        {
          "id": "var_1",
          "size": "M",
          "color": "Đen",
          "sku": "POLO-BLK-M",
          "stockQuantity": 15,
          "price": 250000
        },
        {
          "id": "var_2",
          "size": "L",
          "color": "Đen",
          "sku": "POLO-BLK-L",
          "stockQuantity": 8,
          "price": 250000
        }
      ]
    }
  }
  ```
- **Response `404 Not Found`:**
  ```json
  {
    "success": false,
    "error": "Không tìm thấy sản phẩm yêu cầu",
    "code": "PRODUCT_NOT_FOUND"
  }
  ```

---

### PHẦN II: GIỎ HÀNG (CART)
*(Yêu cầu người dùng đã đăng nhập Session)*

#### 1. Xem giỏ hàng hiện tại
- **Endpoint:** `GET /cart`
- **Quyền:** Authenticated User
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "cartId": "cart_123",
      "items": [
        {
          "id": "cart_item_1",
          "variantId": "var_1",
          "productName": "Áo Polo Nam Classic",
          "size": "M",
          "color": "Đen",
          "price": 250000,
          "quantity": 2,
          "subtotal": 500000,
          "imageUrl": "https://example.com/polo.jpg"
        }
      ],
      "totalQuantity": 2,
      "totalAmount": 500000
    }
  }
  ```

---

#### 2. Thêm sản phẩm vào giỏ
- **Endpoint:** `POST /cart/items`
- **Quyền:** Authenticated User
- **Request Body:**
  ```json
  {
    "variantId": "var_1",
    "quantity": 1
  }
  ```
- **Response `200 OK` / `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Đã thêm sản phẩm vào giỏ hàng thành công",
    "data": {
      "cartItemId": "cart_item_1",
      "quantity": 2
    }
  }
  ```
- **Response `400 Bad Request`:**
  ```json
  {
    "success": false,
    "error": "Số lượng trong kho không đủ (chỉ còn 1 sản phẩm)",
    "code": "OUT_OF_STOCK"
  }
  ```

---

#### 3. Cập nhật số lượng áo trong giỏ
- **Endpoint:** `PUT /cart/items/:id`
- **Quyền:** Authenticated User
- **Request Body:**
  ```json
  {
    "quantity": 3
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Đã cập nhật số lượng thành công"
  }
  ```

---

#### 4. Xóa một món khỏi giỏ
- **Endpoint:** `DELETE /cart/items/:id`
- **Quyền:** Authenticated User
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Đã xóa sản phẩm khỏi giỏ hàng"
  }
  ```

---

### PHẦN III: ĐỊA CHỈ GIAO HÀNG (ADDRESSES)

#### 1. Lấy danh sách địa chỉ của người dùng
- **Endpoint:** `GET /user/addresses`
- **Quyền:** Authenticated User
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "addr_1",
        "recipient": "Trần Quốc Long",
        "phone": "0912345678",
        "street": "97 Man Thiện",
        "ward": "Hiệp Phú",
        "district": "TP Thủ Đức",
        "province": "TP Hồ Chí Minh",
        "isDefault": true
      }
    ]
  }
  ```

---

#### 2. Thêm địa chỉ mới
- **Endpoint:** `POST /user/addresses`
- **Quyền:** Authenticated User
- **Request Body:**
  ```json
  {
    "recipient": "Trần Quốc Long",
    "phone": "0912345678",
    "street": "97 Man Thiện",
    "ward": "Hiệp Phú",
    "district": "TP Thủ Đức",
    "province": "TP Hồ Chí Minh",
    "isDefault": true
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Thêm địa chỉ thành công",
    "data": { "id": "addr_1" }
  }
  ```

---

### PHẦN IV: ĐẶT HÀNG (ORDERS)

#### 1. Tạo đơn hàng mới (Checkout)
- **Endpoint:** `POST /orders`
- **Quyền:** Authenticated User
- **Request Body:**
  ```json
  {
    "addressId": "addr_1",
    "shippingAddress": "97 Man Thiện, P. Hiệp Phú, TP Thủ Đức, TP HCM (Người nhận: Trần Quốc Long - 0912345678)",
    "paymentMethod": "COD", // Enum: "COD", "VIETQR", "MOMO"
    "shippingFee": 30000,
    "discountAmount": 0
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Đặt hàng thành công",
    "data": {
      "orderId": "order_abc123",
      "totalAmount": 530000,
      "status": "PENDING",
      "paymentMethod": "COD"
    }
  }
  ```

---

#### 2. Xem lịch sử đơn hàng của tôi
- **Endpoint:** `GET /orders`
- **Quyền:** Authenticated User
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "order_abc123",
        "totalAmount": 530000,
        "status": "PENDING",
        "paymentMethod": "COD",
        "createdAt": "2026-10-16T13:30:00.000Z",
        "itemCount": 2
      }
    ]
  }
  ```

---

#### 3. Xem chi tiết đơn hàng
- **Endpoint:** `GET /orders/:id`
- **Quyền:** Authenticated User
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "id": "order_abc123",
      "totalAmount": 530000,
      "shippingFee": 30000,
      "discountAmount": 0,
      "status": "PENDING",
      "paymentMethod": "COD",
      "shippingAddress": "97 Man Thiện, P. Hiệp Phú, TP Thủ Đức, TP HCM",
      "createdAt": "2026-10-16T13:30:00.000Z",
      "items": [
        {
          "id": "item_1",
          "quantity": 2,
          "priceAtTime": 250000,
          "variant": {
            "size": "M",
            "color": "Đen",
            "product": {
              "name": "Áo Polo Nam Classic",
              "imageUrl": "https://example.com/polo.jpg"
            }
          }
        }
      ]
    }
  }
  ```

---

### PHẦN V: THANH TOÁN (PAYMENTS - VIETQR & MOMO)

#### 1. Tạo mã VietQR thanh toán ngân hàng
- **Endpoint:** `POST /payments/vietqr/generate`
- **Quyền:** Authenticated User
- **Request Body:**
  ```json
  {
    "orderId": "order_abc123"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Đã tạo mã VietQR thanh toán",
    "data": {
      "paymentId": "pay_vietqr_123",
      "qrUrl": "https://img.vietqr.io/image/970422-0123456789-compact2.png?amount=530000&addInfo=AOSHOP%20order_abc123",
      "bankBin": "970422",
      "bankCode": "MB",
      "accountNo": "0123456789",
      "accountName": "SHOP AO OFFICIAL",
      "amount": 530000,
      "content": "AOSHOP order_abc123",
      "status": "PENDING"
    }
  }
  ```
- **Response `400 Bad Request` / `404 Not Found`:**
  ```json
  {
    "success": false,
    "error": "Đơn hàng không tồn tại hoặc đã được thanh toán",
    "code": "INVALID_ORDER_PAYMENT"
  }
  ```

---

#### 2. Xác nhận thanh toán VietQR (Admin duyệt hoặc Webhook SePay/Casso)
- **Endpoint:** `POST /payments/vietqr/confirm`
- **Quyền:** Admin hoặc Webhook Secret Header
- **Request Body:**
  ```json
  {
    "orderId": "order_abc123",
    "transactionId": "FT263240001122"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Xác nhận thanh toán VietQR thành công",
    "data": {
      "orderId": "order_abc123",
      "paymentStatus": "SUCCESS",
      "orderStatus": "PAID",
      "transactionId": "FT263240001122",
      "paidAt": "2026-11-20T01:20:00.000Z"
    }
  }
  ```

---

#### 3. Tạo giao dịch thanh toán MoMo (Gateway v2)
- **Endpoint:** `POST /payments/momo/create`
- **Quyền:** Authenticated User
- **Request Body:**
  ```json
  {
    "orderId": "order_abc123",
    "requestType": "payWithMethod"
  }
  ```
  *(Tùy chọn `requestType`: `"payWithMethod"` [mặc định, hỗ trợ nhập thẻ test trên web], `"captureWallet"` [quét QR ví MoMo], hoặc `"payWithATM"`).*
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Đã khởi tạo phiên thanh toán MoMo",
    "data": {
      "orderId": "order_abc123",
      "requestId": "REQ_order_abc123_1795112400",
      "payUrl": "https://test-payment.momo.vn/v2/gateway/pay?t=...",
      "qrCodeUrl": "https://test-payment.momo.vn/v2/gateway/qr?t=...",
      "deeplink": "momo://app?action=payWithApp..."
    }
  }
  ```
- **Response `400 Bad Request` / `404 Not Found` / `502 Bad Gateway`:**
  ```json
  {
    "success": false,
    "error": "Không thể tạo giao dịch MoMo lúc này",
    "code": "MOMO_CREATE_FAILED"
  }
  ```

---

#### 4. Webhook IPN nhận kết quả từ MoMo
- **Endpoint:** `POST /payments/momo/ipn`
- **Quyền:** MoMo Server Callback *(Bắt buộc xác thực chữ ký `HMAC-SHA256` bằng `MOMO_SECRET_KEY` trước khi cập nhật bảng `Order` và `Payment`)*
- **Request Body (MoMo gửi về):**
  ```json
  {
    "partnerCode": "MOMOBKUN20180529",
    "orderId": "order_abc123",
    "requestId": "REQ_order_abc123_1795112400",
    "amount": 530000,
    "orderInfo": "Thanh toan don hang order_abc123",
    "orderType": "momo_wallet",
    "transId": 4123456789,
    "resultCode": 0,
    "message": "Successful.",
    "payType": "napas",
    "responseTime": 1795112460000,
    "extraData": "",
    "signature": "a1b2c3d4e5f6..."
  }
  ```
- **Response `200 OK` / `204 No Content`:**
  ```json
  {
    "success": true,
    "message": "IPN processed"
  }
  ```
- **Response `400 Bad Request` (Sai chữ ký `signature`):**
  ```json
  {
    "success": false,
    "error": "Chữ ký IPN MoMo không hợp lệ",
    "code": "INVALID_SIGNATURE"
  }
  ```

---

#### 5. Xác thực kết quả khi MoMo chuyển về `redirectUrl` (Hỗ trợ kiểm thử trên `localhost`)
- **Endpoint:** `GET /payments/momo/verify`
- **Quyền:** Authenticated User
- **Query Parameters:** Nhận toàn bộ query params MoMo trả về trên URL (`partnerCode`, `orderId`, `requestId`, `amount`, `transId`, `resultCode`, `message`, `extraData`, `signature`, ...).
- **Lưu ý:** Backend phải kiểm tra lại chữ ký `signature` (không tin tham số `resultCode=0` trên URL trình duyệt) trước khi đánh dấu thanh toán thành công.
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Thanh toán MoMo thành công",
    "data": {
      "orderId": "order_abc123",
      "paymentStatus": "SUCCESS",
      "orderStatus": "PAID",
      "transactionId": "4123456789"
    }
  }
  ```
- **Response `400 Bad Request` (Chữ ký sai hoặc giao dịch thất bại / bị hủy):**
  ```json
  {
    "success": false,
    "error": "Giao dịch MoMo chưa thành công hoặc chữ ký không hợp lệ",
    "code": "MOMO_VERIFY_FAILED"
  }
  ```

---

## 3. CHECKLIST DÀNH CHO CẢ TEAM
- [ ] **Frontend Dev:** Dựa vào các `Request Body` và `Endpoint` trên để gửi đúng tên trường dữ liệu.
- [ ] **Backend Dev:** Trả về đúng mẫu Envelope `{ success, data, message, error }` và đúng mã HTTP Status (200, 201, 400, 401...).
- [ ] **Tester / QA:** Dùng công cụ Postman / Thunder Client để kiểm thử từng Endpoint theo tài liệu này.
