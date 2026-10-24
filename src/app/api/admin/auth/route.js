import { cookies } from "next/headers"

// shortcut: single env-based admin account, upgrade to role column on User table when multi-admin is needed
const ADMIN_USER = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123"
const COOKIE_NAME = "admin_session"

export async function GET() {
  const cookieStore = await cookies()
  const isAuth = cookieStore.get(COOKIE_NAME)?.value === "authenticated"
  return Response.json({ success: true, data: { authenticated: isAuth } })
}

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return Response.json(
        { success: false, error: "Sai tài khoản hoặc mật khẩu Admin" },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, "authenticated", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    })

    return Response.json({
      success: true,
      message: "Đăng nhập Admin thành công",
    })
  } catch {
    return Response.json(
      { success: false, error: "Dữ liệu gửi lên không hợp lệ" },
      { status: 400 }
    )
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  return Response.json({ success: true, message: "Đã đăng xuất Admin" })
}
