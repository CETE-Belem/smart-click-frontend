"use server";

import { api } from "@/lib/axios";

export async function resendConfirmationCode(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api
      .patch(`/users/${email}/resend-confirmation-code`)
      .then((response) => response)
      .catch((error) => error.response.data);

    if (response.status === 200) {
      return {
        success: true,
        message: "Código de confirmação reenviado com sucesso",
      };
    }

    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao criar usuário. Exceção: " + error,
    };
  }
}
