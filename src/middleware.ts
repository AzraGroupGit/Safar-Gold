import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const CS_RESTRICTED_PAGES = ["/admin/jenis-emas", "/admin/konten", "/admin/pengaturan", "/admin/users"];
const CS_RESTRICTED_API = [
  "/api/admin/publish-prices",
  "/api/admin/update-settings",
  "/api/admin/update-konten",
  "/api/admin/update-gold-types",
  "/api/admin/update-gold-type",
  "/api/admin/create-gold-type",
  "/api/admin/delete-gold-type",
  "/api/admin/trigger-update",
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    if (user) return NextResponse.redirect(new URL("/admin", request.url));
    return response;
  }

  if (!user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const role = user.user_metadata?.role ?? "admin";

  if (role === "cs") {
    if (CS_RESTRICTED_API.some((p) => pathname.startsWith(p))) {
      return NextResponse.json({ error: "Forbidden — hanya Admin" }, { status: 403 });
    }
    if (CS_RESTRICTED_PAGES.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
