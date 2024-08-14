import type { NextRequest } from "next/server";
import { verifyAuth } from "../src/lib/auth";
import { Routes } from "./enums/Routes.enum";

const noNeedAuth = ["/login", "/no-permission", "/register", "/confirm-email"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (token && request.nextUrl.pathname == "/login") {
    return Response.redirect(new URL(Routes.Equipments, request.url));
  }

  if (!token && noNeedAuth.includes(request.nextUrl.pathname) === false) {
    return Response.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname.includes("/admin")) {
    if (token === undefined || process.env.JWT_PUBLIC_KEY === undefined)
      return Response.redirect(new URL("/login", request.url));

    const verified = await verifyAuth(token).catch((err) => console.log(err));

    if (!verified || !verified.role || verified.role !== "Admin") {
      return Response.redirect(new URL("/no-permission", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
