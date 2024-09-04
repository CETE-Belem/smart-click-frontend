'use server'

import { api } from "@/lib/axios"
import { NewConcessionaireSchema, NewConcessionaireSchemaType } from "@/schemas/new-concessionaire.schema"
import { cookies } from "next/headers"
import { NewConcessionaireDataType } from "./new-concessionaire-action"

export async function adminEditConcessionaireAction(
    formData: NewConcessionaireSchemaType,
    cod_concessionaire: string
): Promise<{success: boolean; message: string}> {
    try {
        const result = NewConcessionaireSchema.safeParse(formData);
        const newFormData = result.data!;
        const token = cookies().get("token")?.value
        const parsedData: NewConcessionaireDataType = {
            name: newFormData.name,
            city: newFormData.city,
            uf: newFormData.uf,
        };

        const response =  await api.patch(`/concessionaires/${cod_concessionaire}`, parsedData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response)
        .catch((error) => error.response.data)
        console.log(response)
        if(response.status === 200) {
            return {
                success: true,
                message: "Concessionária editada com sucesso"
            }
        }

        if (response.statusCode === 404) {
            return {
              success: false,
              message: "Concessionária não encontrada",
            };
          }

        return {
            success: false,
            message: response.message,
          };
    } catch (error) {
        return {
            success: false,
            message: "Erro ao editar a concessionária. Exceção: " + error,
        };
    }
}