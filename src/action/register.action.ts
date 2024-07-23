"use server"

import { api } from "@/lib/axios"
import { RegisterSchemaType, RegisterSchemaTransformed } from "@/schemas/register.schema"
import { cookies } from "next/headers"

export async function registerAction(formData: RegisterSchemaType): Promise<{ success: boolean, message: string }> {
    try {
        const result = RegisterSchemaTransformed.safeParse(formData);
        const newFormData = result.data!

        const response = await api.post("/users", newFormData)
            .then(response => response)
            .catch(error => error.response.data)

        if (response.status === 201) {
            cookies().set("token", response.data.accessToken)
            return {
                success: true,
                message: "Usuário criado com sucesso"
            }
        }

        if (response.statusCode === 403) {
            return {
                success: false,
                message: "Captcha inválido"
            }
        }

        if (response.statusCode === 409) {
            return {
                success: false,
                message: "Email já cadastrado"
            }
        }

        return {
            success: false,
            message: response.data.message
        }
    } catch (error) {
        return {
            success: false,
            message: "Erro ao criar usuário. Exceção: " + error
        }
    }
}