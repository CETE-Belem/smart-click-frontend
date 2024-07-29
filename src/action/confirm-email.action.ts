"use server";

import { api } from "@/lib/axios";
import { ConfirmEmailType, ConfirmEmail } from "@/schemas/confirm-email.schema";
import { cookies } from "next/headers";

export async function confirmEmail(
  formData: ConfirmEmailType,
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    const result = ConfirmEmail.safeParse(formData);
    const newFormData = result.data!;

    const response = await api
      .patch(`/users/${email}/confirm-code`, newFormData)
      .then((response) => response)
      .catch((error) => error.response.data);

    if (response.status === 200) {
      return {
        success: true,
        message: "Email confirmado com sucesso",
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
