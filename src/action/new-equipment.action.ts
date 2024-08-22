"use server";

import { api } from "@/lib/axios";
import {
  NewEquipmentSchema,
  NewEquipmentSchemaType,
} from "@/schemas/new-equipment.schema";
import { cookies } from "next/headers";

export interface NewEquipmentDataType {
  mac: string;
  name: string;
  description: string;
  numeroUnidadeConsumidora: string;
  uf: string;
  cidade: string;
  subgrupo: string;
  tensaoNominal: number;
  fases_monitoradas: string;
}

export async function newEquipmentAction(
  formData: NewEquipmentSchemaType
): Promise<{ success: boolean; message: string }> {
  try {
    const result = NewEquipmentSchema.safeParse(formData);
    const newFormData = result.data!;
    const token = cookies().get("token")?.value;
    const parsedData: NewEquipmentDataType = {
      mac: newFormData.mac,
      name: newFormData.name,
      description: newFormData.description,
      numeroUnidadeConsumidora: newFormData.consumerUnityNumber,
      uf: newFormData.uf,
      cidade: newFormData.city,
      subgrupo: newFormData.subGroup,
      tensaoNominal: Number(newFormData.ratedVoltage),
      fases_monitoradas: newFormData.monitoredPhases,
    };

    const response = await api
      .post("/equipments", parsedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response)
      .catch((error) => error.response.data);

    if (response.status === 201) {
      return {
        success: true,
        message: "Equipamento criado com sucesso",
      };
    }

    if (response.statusCode === 409) {
      return {
        success: false,
        message: "Equipamento já cadastrado",
      };
    }

    return {
      success: false,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao criar equipamento. Exceção: " + error,
    };
  }
}
