"use server"

import { api } from "@/lib/axios"
import { RecoverPasswordEmailSchema, RecoverPasswordEmailSchemaType, RecoverPasswordSchemaTransformed, RecoverPasswordSchema, RecoverPasswordSchemaType } from "@/schemas/recover-password.schema"

export async function sendEmailToRecoverPassword(formData: RecoverPasswordEmailSchemaType): Promise<{
    success: boolean; message: string
}> {
    try {
        const result = RecoverPasswordEmailSchema.safeParse(formData)
        const newFormData = result.data!

        const response = await api.patch(`/users/${newFormData.email}/send-recover-code`)
            .then(response => response)
            .catch(error => error.response)

        if (response.status === 200) {
            return {
                success: true,
                message: "Código de recuperação de senha enviado"
            }
        }

        return {
            success: false,
            message: response.data.message
        }
    } catch (error) {
        return {
            success: false,
            message: "Erro ao enviar código de recuperação de senha. Exceção: " + error
        }
    }
}

export async function recoverPassword(formData: RecoverPasswordSchemaType, email: string): Promise<{ success: boolean; message: string }> {
    try {
        const result = RecoverPasswordSchemaTransformed.safeParse(formData)
        const newFormData = result.data!

        const response = await api.patch(`/users/${email}/recover-password`, newFormData)
        .then(response => response)
        .catch(error => error.response)

        if (response.status === 200) {
            return {
                success: true,
                message: "Senha alterada com sucesso"
            }
        }

        return {
            success: false,
            message: response.data.message
        }
    } catch (error) {
        return {
            success: false,
            message: "Erro ao recuperar senha. Exceção: " + error
        }
    }
}