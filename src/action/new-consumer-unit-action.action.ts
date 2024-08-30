'use server'

import { api } from "@/lib/axios";
import {
    NewConsumerUnitSchema,
    NewConsumerUnitSchemaType,
} from "@/schemas/new-consumer-unit.schema";
import { cookies } from "next/headers";

export interface NewConsumerUnitDataType {
    numero: string,
    cidade: string,
    uf: string,
    cod_concessionaria: string,
    subgrupo: string,
    optanteTB: boolean,
}

export async function newConsumerUnitAction(
    formData: NewConsumerUnitSchemaType
): Promise<{ success: boolean; message: string }> {
    try {
        const result = NewConsumerUnitSchema.safeParse(formData);
        const newFormData = result.data!;
        const token = cookies().get("token")?.value;
        const parsedData: NewConsumerUnitDataType = {
            numero: newFormData?.number,
            cidade: newFormData.city,
            uf: newFormData.uf,
            cod_concessionaria: newFormData.city,
            subgrupo: newFormData.subGroup,
            optanteTB: newFormData.optanteTB,
        };

        const response = await api.post("/consumer-units", parsedData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => response)
        .catch((error) => error.response.data);

        if(response.status === 201) {
            return {
                success: true,
                message: "Unidade consumidora criada com sucesso",
            };
        }

        if(response.status === 409) {
            return {
                success: false,
                message: "Unidade consumidora já cadastrada",
            };
        }

        
        return{
            success: false,
            message: response.message,
        };
    } catch (error) {
        return{
            success: false,
            message: "Erro ao criar unidade consumidora. Exceção: " + error,
        };
    }
}