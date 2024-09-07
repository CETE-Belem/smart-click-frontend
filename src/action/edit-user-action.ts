"use server"

import { api } from "@/lib/axios";
import { cookies } from "next/headers";
import { NewUserSchema, NewUserSchemaType } from "@/schemas/new-user.schema";

export async function adminEditUserAction(
    formData: NewUserSchemaType,
    cod_usuario: string
): Promise<{ success: boolean; message: string }> {
    try {
        const result = NewUserSchema.safeParse(formData);
        const newFormData = result.data!;
        const token = cookies().get("token")?.value;
        const parsedData: NewUserSchemaType = {
            name: newFormData.name,
            email: newFormData.email,
            role: newFormData.role,
        };

        const response = await api
            .patch(`/users/${cod_usuario}`, parsedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => response)
            .catch((error) => error.response.data);

        if (response.status === 200) {
            return {
                success: true,
                message: "Usuário editado com sucesso",
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
            message: response.message,
        };
    } catch (error) {
        return {
            success: false,
            message: "Erro ao editar o usuário. Exceção: " + error,
        };
    }
}