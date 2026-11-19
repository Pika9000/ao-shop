# Báo cáo nhánh `feature/cart`

- **Nhánh gốc:** `main` (`324ba64`)
- **Nhánh làm việc:** `feature/cart`
- **Ngày thực hiện:** 2026-11-20
- **Mục tiêu:** Bổ sung hệ thống API Giỏ hàng (CRUD + kiểm tra tồn kho từ MySQL), giao diện UI cơ bản cho trang `/cart`, cập nhật đặc tả [API_SPECIFICATION.md](../API_SPECIFICATION.md) và triển khai trọn bộ 5 API thanh toán **VietQR & MoMo**.

---

## 1. Danh sách file thay đổi & thêm mới

### Thêm mới
- `src/lib/cart.js`: Helper đọc/ghi cookie giỏ hàng (`readCartCookie`, `writeCartCookie`) và dựng dữ liệu giỏ hàng đối chiếu trực tiếp từ bảng `products` qua `prisma.product` (`buildCartData`).
- `src/app/cart/page.jsx`: Trang giao diện Giỏ hàng (`/cart`), tích hợp 2 nút thanh toán **VietQR** (hiển thị ảnh QR & thông tin chuyển khoản) và **MoMo** (chuyển hướng sang MoMo Sandbox và tự xác thực khi redirect về `/cart`).
- `src/lib/payment.js`: Helper cấu hình VietQR & MoMo Sandbox (`redirectUrl` mặc định trỏ về `/cart`), đối chiếu tiền từ đơn hàng/giỏ hàng phía server (`resolvePaymentOrder`), dựng ảnh VietQR (`buildVietQrData`), ký và xác thực chữ ký `HMAC-SHA256` bằng `timingSafeEqual` (`signMomoCreate`, `verifyMomoCallback`), cập nhật trạng thái đơn hàng (`markOrderPaidIfExists`), kiểm tra quyền xác nhận VietQR (`isVietQrConfirmAuthorized`).
- `src/app/api/cart/route.js`: Route Handler `GET /api/cart` và `DELETE /api/cart`.
- `src/app/api/cart/items/route.js`: Route Handler `POST /api/cart/items`.
- `src/app/api/cart/items/[id]/route.js`: Route Handler `PUT /api/cart/items/[id]` và `DELETE /api/cart/items/[id]`.
- `src/app/api/payments/vietqr/generate/route.js`: Route Handler `POST /api/payments/vietqr/generate`.
- `src/app/api/payments/vietqr/confirm/route.js`: Route Handler `POST /api/payments/vietqr/confirm`.
- `src/app/api/payments/momo/create/route.js`: Route Handler `POST /api/payments/momo/create`.
- `src/app/api/payments/momo/ipn/route.js`: Route Handler `POST /api/payments/momo/ipn`.
- `src/app/api/payments/momo/verify/route.js`: Route Handler `GET /api/payments/momo/verify`.
- `tests/cart-api.test.mjs`: Script tự kiểm tra end-to-end các API giỏ hàng và render trang `/cart`.
- `tests/payment-api.test.mjs`: Script tự kiểm tra end-to-end 5 API VietQR & MoMo (gọi thật tới MoMo Sandbox và xác nhận trạng thái trong MySQL).
- `reports/feature-cart.md`: File báo cáo thay đổi của nhánh `feature/cart`.

### Chỉnh sửa
- `src/components/CartContext.jsx`: Bỏ lưu tạm bằng `localStorage`, đồng bộ toàn bộ thao tác (`refreshCart`, `addToCart`, `updateQuantity`, `removeItem`, `clearCart`) qua API `/api/cart`.
- `src/app/globals.css`: Thêm các class CSS `.cart-*`, `.btn-vietqr`, `.btn-momo` phục vụ trang `/cart`.
- `prisma/schema.prisma`: Đổi giá trị `PAYPAL` trong `enum PaymentMethod` sang `MOMO`.
- `API_SPECIFICATION.md`: Nâng lên `v1.1`, cập nhật enum `paymentMethod` (`"COD"`, `"VIETQR"`, `"MOMO"`) và thay thế Phần V từ PayPal sang đặc tả 5 endpoint cho **VietQR & MoMo** (`/payments/vietqr/generate`, `/payments/vietqr/confirm`, `/payments/momo/create`, `/payments/momo/ipn`, `/payments/momo/verify`).

---

## 2. Chi tiết API đã triển khai

Tất cả API trả về envelope JSON thống nhất `{ success, message, data }` (khi thành công) hoặc `{ success: false, error, code }` (khi lỗi):

| Method | Endpoint | Chức năng | Mã trạng thái |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Lấy danh sách sản phẩm trong giỏ, `totalQuantity`, `totalAmount` | `200`, `500` |
| `DELETE` | `/api/cart` | Xóa toàn bộ giỏ hàng | `200`, `500` |
| `POST` | `/api/cart/items` | Thêm sản phẩm (`productId` hoặc `variantId`, `quantity`), cộng dồn nếu đã có và kiểm tra tồn kho | `201`, `400`, `404`, `500` |
| `PUT` | `/api/cart/items/[id]` | Cập nhật số lượng của 1 sản phẩm theo `id`, kiểm tra tồn kho | `200`, `400`, `404`, `500` |
| `DELETE` | `/api/cart/items/[id]` | Xóa 1 sản phẩm khỏi giỏ theo `id` | `200`, `404`, `500` |
| `POST` | `/api/payments/vietqr/generate` | Tạo URL ảnh VietQR và thông tin chuyển khoản theo `orderId` hoặc giỏ hàng hiện tại | `200`, `400`, `404`, `500` |
| `POST` | `/api/payments/vietqr/confirm` | Xác nhận thanh toán VietQR -> `PAID` (yêu cầu session Admin hoặc `x-webhook-secret`) | `200`, `400`, `401`, `404`, `500` |
| `POST` | `/api/payments/momo/create` | Ký `HMAC-SHA256` và khởi tạo giao dịch MoMo Sandbox v2 (`payUrl`, `qrCodeUrl`, `deeplink`) | `200`, `400`, `404`, `502` |
| `POST` | `/api/payments/momo/ipn` | Webhook IPN từ MoMo, kiểm tra chữ ký bằng `timingSafeEqual` và cập nhật đơn `PAID` | `200`, `400`, `500` |
| `GET` | `/api/payments/momo/verify` | Kiểm tra chữ ký query params khi MoMo redirect về, cập nhật đơn `PAID` hoặc xóa giỏ cookie | `200`, `400`, `500` |

---

## 3. Giao diện UI Giỏ hàng (`/cart`)

- Hiển thị trạng thái đang tải (`loading`).
- Khi giỏ trống: hiển thị thông báo và nút `← Tiếp tục mua sắm` quay về `/`.
- Khi có sản phẩm:
  - Header hiển thị tổng số lượng sản phẩm và nút `Xóa tất cả` (có hộp thoại xác nhận `window.confirm`).
  - Bảng sản phẩm: ảnh, tên sản phẩm, số lượng tồn kho, đơn giá (VNĐ), nút tăng/giảm số lượng (`+`/`-`, vô hiệu hóa `-` khi số lượng `<= 1`), thành tiền, nút `Xóa` từng món.
  - Khung tổng kết bên dưới: tổng số lượng, tổng thanh toán (VNĐ), link quay lại trang chủ, nút **Thanh toán VietQR** và nút **Thanh toán MoMo**.
  - Khi bấm **Thanh toán VietQR**: hiển thị khung mã QR ảnh `vietqr.io`, ngân hàng, số tài khoản, tên tài khoản, số tiền và nội dung chuyển khoản (tự ẩn khi sửa giỏ hàng để tránh sai số tiền).
  - Khi bấm **Thanh toán MoMo**: chuyển hướng sang MoMo Sandbox; khi MoMo redirect về `/cart?partnerCode=...&signature=...`, trang tự gọi `GET /api/payments/momo/verify`, xóa query params trên URL, hiển thị thông báo thành công/lỗi và làm mới giỏ hàng (`refreshCart()`).
  - Tự động hiển thị thông báo lỗi từ server nếu tăng vượt quá tồn kho hoặc khởi tạo thanh toán thất bại.

---

## 4. Kết quả kiểm thử (đã chạy trên máy)

- `node --check` cho toàn bộ 4 file JS giỏ hàng và 6 file JS thanh toán (`src/lib/payment.js` + 5 route `/api/payments/...`): **Pass (exit code 0)**.
- `node --env-file=.env tests/cart-api.test.mjs` chạy trực tiếp trên server `http://localhost:3000` kết nối MySQL `ao_db`: **Pass (`ALL CART API & UI CHECKS PASSED`)**, bao gồm:
  - Giỏ ban đầu rỗng (`200`), chặn `quantity <= 0` (`400`) và sản phẩm không tồn tại (`404`).
  - Thêm mới + cộng dồn số lượng (`201`), chặn vượt tồn kho (`400`, `OUT_OF_STOCK`).
  - Cập nhật số lượng (`200`, tính lại `subtotal`), xóa từng món (`200`/`404`), xóa toàn bộ (`200`), và UI `/cart` (`200`).
- `node --env-file=.env tests/payment-api.test.mjs` chạy trên `http://localhost:3000`: **Pass (`ALL VIETQR & MOMO PAYMENT API CHECKS PASSED`)**, bao gồm:
  - `POST /api/payments/vietqr/generate`: giỏ trống (`400`), `orderId` không tồn tại (`404`), sinh `qrUrl` hợp lệ (`200`).
  - `POST /api/payments/vietqr/confirm`: chặn chưa đăng nhập (`401`), cập nhật đơn tạm thành `PAID` (`200`) và chặn xác nhận trùng (`400`, `ORDER_ALREADY_PAID`).
  - `POST /api/payments/momo/create`: chặn `requestType` sai (`400`), `orderId` sai (`404`), gọi thật tới `https://test-payment.momo.vn/v2/gateway/api/create` thành công (`200`, nhận `payUrl` hợp lệ).
  - `POST /api/payments/momo/ipn` & `GET /api/payments/momo/verify`: chặn chữ ký giả (`400`, `INVALID_SIGNATURE`), xử lý đơn hủy (`400`, `MOMO_VERIFY_FAILED`), xác nhận chữ ký `HMAC-SHA256` hợp lệ -> cập nhật đơn `PAID` và xóa giỏ hàng (`200`).
  - Dọn sạch bản ghi test tạm (`orders: 0`, `users: 0`) và xác nhận HTTP `200` cho `/`, `/admin/login`, `/cart`.

---

## 5. Lưu ý & Rủi ro (Shortcut)

- **Lưu giỏ hàng bằng cookie `httpOnly` (`ao_cart`):** Do DB MySQL hiện tại trên nhánh `main` chưa migrate các bảng `carts`, `cart_items`, `product_variants` và chưa cấu hình xong User Auth, giỏ hàng tạm thời lưu danh sách `[{ productId, quantity }]` trong cookie `ao_cart` (đã gắn comment `shortcut:` trong `src/lib/cart.js`). Giá và tồn kho luôn được truy vấn lại từ MySQL phía server.
- **Fallback key MoMo Sandbox & thông tin ngân hàng VietQR:** `src/lib/payment.js` dùng thông tin ngân hàng placeholder và bộ key MoMo Sandbox công khai (`MOMOBKUN20180529`) làm mặc định khi chưa khai báo env vars (đã gắn `shortcut:`). Cần cấu hình key thật và `VIETQR_WEBHOOK_SECRET` trong `.env` trước khi đưa lên production.
- **Chưa lưu vào bảng `payments`:** DB `ao_db` hiện tại mới chỉ có bảng `orders` (chưa migrate bảng `payments` theo `schema.prisma` mới), nên API thanh toán hiện cập nhật trực tiếp `status = "PAID"` và `paymentMethod` trên bảng `orders`.
- **Hướng nâng cấp:** Sau khi nhóm gộp nhánh `feature-back` + schema DB mới vào `main` và chạy migrate, nâng cấp `src/lib/cart.js` để đọc/ghi bảng `Cart`/`CartItem` theo `userId` và `src/lib/payment.js` để ghi lịch sử giao dịch vào bảng `Payment`.
