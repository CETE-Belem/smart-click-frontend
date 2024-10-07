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
      .catch((error) => error.response);

    if (response.status === 201) {
      cookies().set("token", response.data.accessToken);
      return {
        success: true,
        message: "Usuário autenticado com sucesso",
        user: response.data.user,
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
