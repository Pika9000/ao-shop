This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Cấu hình biến môi trường (`.env`)

Vì các file `.env*` chứa thông tin nhạy cảm nên đã bị chặn trong `.gitignore`. Khi mới `git clone` dự án về máy, bạn cần thực hiện các bước sau trước khi chạy:

1. Tạo một file tên là **`.env`** ở thư mục gốc của dự án (ngang hàng với `package.json`).
2. Dán nội dung mẫu dưới đây vào file `.env` và thay thế bằng thông tin máy của bạn:

```env
# 1. Kết nối MySQL (Thay root:mat_khau bằng tài khoản và mật khẩu MySQL trên máy của bạn)
DATABASE_URL="mysql://root:mat_khau_cua_ban@localhost:3306/ao_db"

# 2. Cấu hình NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_super_secret_key_generate_one"

# 3. Đăng nhập Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# 4. Cấu hình gửi Email (Nodemailer)
EMAIL_SERVER_USER="your_email@gmail.com"
EMAIL_SERVER_PASSWORD="your_app_password"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="465"
EMAIL_FROM="your_email@gmail.com"

# 5. Thanh toán PayPal & VietQR
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_paypal_client_id"
NEXT_PUBLIC_BANK_BIN=970436
NEXT_PUBLIC_BANK_ACCOUNT="your_bank_account_number"
NEXT_PUBLIC_BANK_ACCOUNT_NAME="your_bank_account_name"

# 6. Tài khoản Quản trị (Admin)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
```

> **Lưu ý quan trọng:**
> - Đảm bảo bạn đã tạo sẵn database tên `ao_db` trong MySQL (`CREATE DATABASE ao_db;`).
> - Nếu trong máy bạn có cả 2 file `.env` và `.env.local`, Next.js sẽ ưu tiên đọc `.env.local` đè lên `.env` (trong khi Prisma CLI đọc `.env`). Vì vậy hãy dùng thống nhất 1 file `.env` hoặc đảm bảo `DATABASE_URL` ở cả 2 file giống hệt nhau.
> - Sau khi cấu hình `.env` xong, chạy lệnh `npx prisma db push` (để tạo bảng) trước khi chạy `npm run dev`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
