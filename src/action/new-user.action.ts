'use server'
import { api } from "@/lib/axios"
import { NewUserSchema, NewUserSchemaType } from "@/schemas/new-user.schema"
import { cookies } from "next/headers";

export interface NewUserDataType {
    name: string;
    email: string;
    password: string;
    consumerUnityNumber: string;
}

export async function newUserAction(
    formData: NewUserSchemaType
): Promise<{ success: boolean; message: string }> {
    try {
        const result = NewUserSchema.safeParse(formData);
        const newFormData = result.data!;
        const token = cookies().get("token")?.value;
        const parsedData: NewUserDataType = {
            name: newFormData.name,
            email: newFormData.email,
            password: newFormData.password,
            consumerUnityNumber: newFormData.consumerUnityNumber,
        };
        
        const response = await api.post("/users", parsedData, {
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