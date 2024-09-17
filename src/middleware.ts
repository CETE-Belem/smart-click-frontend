import type { NextRequest } from "next/server";
import { verifyAuth } from "../src/lib/auth";
import { Routes } from "./enums/Routes.enum";
import { Role } from "./enums/Role.enum";

const noNeedAuth = [
  "/login",
  "/no-permission",
  "/register",
  "/confirm-email",
  "/recover-password/email",
  "/recover-password/password",
];

const AdminPages = [Routes.EquipmentsNew, Routes.Concessionaires, Routes.Concessionaire, Routes.ConcessionaireEdit, Routes.ConcessionaireNew, Routes.ConsumerUnitNew, Routes.ConsumerUnitEdit, Routes.Users, Routes.AdminNew, Routes.User];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Verifica se o usuário já está logado e tenta acessar a página de login
  if (token && request.nextUrl.pathname === "/login") {
    return Response.redirect(new URL(Routes.MainPage, request.url));
  }

  // Verifica se o token não existe e o usuário tenta acessar uma rota protegida
  if (!token && !noNeedAuth.includes(request.nextUrl.pathname)) {
    return Response.redirect(new URL("/login", request.url));
  }

  // Se o usuário está logado, verifica as permissões e o e-mail
  if (token) {
    const verified = await verifyAuth(token).catch((err) => console.log(err));

    if (!verified) {
      // Redireciona para o login se o token for inválido
      return Response.redirect(new URL("/login", request.url));
    }

    // Verifica se o e-mail não está confirmado e redireciona
    if (
      !verified.confirmEmail &&
      request.nextUrl.pathname !== "/confirm-email"
    ) {
      return Response.redirect(
        new URL(`/confirm-email?email=${verified.email}`, request.url)
      );
    }

    // Verifica permissões de administrador para páginas administrativas
    if (
      (request.nextUrl.pathname.includes("/admin") ||
        AdminPages.includes(request.nextUrl.pathname as Routes)) &&
      verified.role !== Role.ADMIN
    ) {
      return Response.redirect(new URL("/no-permission", request.url));
    }
  }

  // Continua com a requisição normalmente
  return;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
