'use server'
import { api } from "@/lib/axios"
import { NewAdminSchema, NewAdminSchemaType } from "@/schemas/new-admin.schema"
import { cookies } from "next/headers";

export interface NewAdminDataType {
    name: string;
    email: string;
    password: string;
}

export async function NewAdminAction(
    formData: NewAdminSchemaType
): Promise<{ success: boolean; message: string }> {
    try {
        const result = NewAdminSchema.safeParse(formData);
        const newFormData = result.data!;
        const token = cookies().get("token")?.value;
        const parsedData: NewAdminDataType = {
            name: newFormData.name,
            email: newFormData.email,
            password: newFormData.password,
        };
        
        const response = await api.post("/users/admin", parsedData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response)
        .catch((error) => error.response.data);

        if(response.status === 201) {
            return {
                success: true,
                message: "Usuário criado com sucesso",
            };
        }

        if(response.status === 409) {
            return {
                success: false,
                message: "Usuário já cadastrado",
            };
        }

        return {
            success: false,
            message: "Erro ao criar usuário",
        };
        
    } catch (error) {
        return {
            success: false,
            message: "Erro ao criar usuário. Exceção: " + error,
        }
    }
}