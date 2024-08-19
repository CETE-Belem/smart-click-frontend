"use server";

import { api } from "@/lib/axios";
import { AuthSchemaType } from "@/schemas/auth.schema";
import { IUser } from "@/types/IUser";
import { cookies } from "next/headers";

export async function authAction(
  formData: AuthSchemaType
): Promise<{ success: boolean; message: string; user?: IUser }> {
  try {
    const response = await api
      .post("/auth/login", formData)
      .then((response) => response)
      .catch((error) => error.response.data);

    if (response.status === 201) {
      cookies().set("token", response.data.accessToken);
      return {
        success: true,
        message: "Usuário autenticado com sucesso",
        user: response.data.user,
      };
    }

    if (response.statusCode === 401) {
      return {
        success: false,
        message: "Credenciais inválidas",
      };
    }

    if (response.statusCode === 403) {
      return {
        success: false,
        message: "Captcha inválido",
      };
    }

    if (response.statusCode === 404) {
      return {
        success: false,
        message: "Usuário não encontrado",
      };
    }

    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao autenticar usuário. Exceção: " + error,
    };
  }
}
