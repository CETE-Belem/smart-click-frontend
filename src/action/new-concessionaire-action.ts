'use server'

import { api } from "@/lib/axios"
import {
    NewConcessionaireSchema,
    NewConcessionaireSchemaType
} from "@/schemas/new-concessionaire.schema"
import { cookies } from "next/headers"

export interface NewConcessionaireDataType {
    name: string,
    city: string,
    uf: string,
}

export async function newConcessionaireAction(
    formData: NewConcessionaireSchemaType
): Promise<{ success: boolean; message: string }> {
    try {
        const result = NewConcessionaireSchema.safeParse(formData);
        const newFormData = result.data!
        const token = cookies().get("token")?.value
        const parsedData: NewConcessionaireDataType = {
            name: newFormData.name,
            city: newFormData.city,
            uf: newFormData.uf
        }

        const response = await api.post("/concessionaires", parsedData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => response)
        .catch((error) => error.response.data)

        if(response.status === 201) {
            return {
                success: true,
                message: "Concessionária criada com sucesso"
            }
        }

        if(response.status === 409) {
            return {
                success: false,
                message: "Concessionária já cadastrada"
            }
        }

        return{
            success: false,
            message: response.message,
        }
    } catch (error) {
        return{
            success: false,
            message: "Erro ao criar unidade consumidora. Exceção " + error,
        }
    }
}