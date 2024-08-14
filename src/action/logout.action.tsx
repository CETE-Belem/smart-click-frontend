"use server"
import { QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'

export async function logoutAction() {
  cookies().delete("token");
  redirect("/login");
}