"use server";

import { api } from "@/lib/axios";
import {
  NewEquipmentSchema,
  NewEquipmentSchemaType,
} from "@/schemas/new-equipment.schema";
import { cookies } from "next/headers";
import { NewEquipmentDataType } from "./new-equipment.action";

export interface UserEditEquipmentDataType {
  name: string;
  description: string | null | undefined;
}

export async function userEditEquipmentAction(
  formData: UserEditEquipmentDataType,
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const result = NewEquipmentSchema.safeParse(formData);
    const newFormData = result.data!;
    const token = cookies().get("token")?.value;
    const parsedData: UserEditEquipmentDataType = {
      name: newFormData.name,
      description: newFormData.description || null,
    };

    const response = await api
      .patch(`/equipments/${id}`, parsedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response)
      .catch((error) => error.response);

    if (response.status === 200) {
      return {
        success: true,
        message: "Equipamento editado com sucesso",
      };
    }

    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao editar equipamento. Exceção: " + error,
    };
  }
}

export async function adminEditEquipmentAction(
  formData: NewEquipmentSchemaType,
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const result = NewEquipmentSchema.safeParse(formData);
    const newFormData = result.data!;
    const token = cookies().get("token")?.value;
    const parsedData: NewEquipmentDataType = {
      mac: newFormData.mac,
      name: newFormData.name,
      description: newFormData.description || null,
      numeroUnidadeConsumidora: newFormData.consumerUnityNumber,
      uf: newFormData.uf,
      cidade: newFormData.city,
      tensaoNominal: Number(newFormData.ratedVoltage),
      fases_monitoradas: newFormData.monitoredPhases,
    };

    const response = await api
      .put(`/equipments/${id}`, parsedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response)
      .catch((error) => error.response);

    if (response.status === 200) {
      return {
        success: true,
        message: "Equipamento editado com sucesso",
      };
    }

    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao editar equipamento. Exceção: " + error,
    };
  }
}
