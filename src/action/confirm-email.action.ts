"use server";

import { api } from "@/lib/axios";
import { ConfirmEmailType, ConfirmEmail } from "@/schemas/confirm-email.schema";

export async function confirmEmail(
  formData: ConfirmEmailType,
  email: string
): Promise<{ success: boolean; message: string; token?: string }> {
  try {
    const result = ConfirmEmail.safeParse(formData);
    const newFormData = result.data!;

    const response = await api
      .patch(`/users/${email}/confirm-code`, newFormData)
      .then((response) => response)
      .catch((error) => error.response);

    if (response.status === 200) {
      return {
        success: true,
        message: "Email confirmado com sucesso",
        token: response.data.accessToken,
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
