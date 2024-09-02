'use server'

import { api } from "@/lib/axios"
import { NewConsumerUnitSchema, NewConsumerUnitSchemaType } from "@/schemas/new-consumer-unit.schema"
import { cookies } from "next/headers"
import { NewConsumerUnitDataType } from "./new-consumer-unit-action.action"

export async function adminEditConsumerUnitAction(
    formData: NewConsumerUnitSchemaType,
    cod_consumer_unit: string
): Promise<{success: boolean; message: string}> {
    try {
        const result = NewConsumerUnitSchema.safeParse(formData);
        const newFormData = result.data!;
        const token = cookies().get("token")?.value
        const parsedData: NewConsumerUnitDataType = {
            numero: newFormData.number,
            subgrupo: newFormData.subGroup,
            cidade: newFormData.city,
            uf: newFormData.uf,
            optanteTB: newFormData.optanteTB,
            cod_concessionaria: newFormData.cod_concessionaire,
        };

        const response = await api
        .patch(`/consumer-units/${cod_consumer_unit}`, parsedData, {
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
                message: "Unidade consumidora editada com sucesso"
            }
        }

        if (response.statusCode === 404) {
            return {
              success: false,
              message: "Unidade consumidora não encontrada",
            };
          }

        return {
            success: false,
            message: response.message,
          };
    } catch (error) {
        return {
            success: false,
            message: "Erro ao editar unidade consumidora. Exceção: " + error,
        };
    }
}