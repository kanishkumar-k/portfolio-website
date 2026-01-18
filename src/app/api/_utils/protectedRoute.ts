import { NextRequest, NextResponse } from "next/server";

export function protectedRoute(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const adminUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "123";
  if (!auth || !auth.startsWith("Basic ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const base64 = auth.replace("Basic ", "");
  const [user, pass] = atob(base64).split(":");
  if (user !== adminUser || pass !== adminPass) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null; // Authenticated
}
