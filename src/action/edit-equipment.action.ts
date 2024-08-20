"use server";

import { api } from "@/lib/axios";
import {
  NewEquipmentSchema,
  NewEquipmentSchemaType,
} from "@/schemas/new-equipment.schema";
import { cookies } from "next/headers";
import { NewEquipmentDataType } from "./new-equipment.action";

interface UserEditEquipmentDataType {
  name: string;
  description: string;
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
      description: newFormData.description,
    };

    const response = await api
      .patch(`/equipments/${id}`, parsedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response)
      .catch((error) => error.response.data);

    if (response.status === 200) {
      return {
        success: true,
        message: "Equipamento editado com sucesso",
      };
    }

    if (response.statusCode === 404) {
      return {
        success: false,
        message: "Equipamento não encontrado",
      };
    }

    return {
      success: false,
      message: response.message,
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
      description: newFormData.description,
      numeroUnidadeConsumidora: newFormData.consumerUnityNumber,
      uf: newFormData.uf,
      cidade: newFormData.city,
      subgrupo: newFormData.subGroup,
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
      .catch((error) => error.response.data);
    console.log(response);
    if (response.status === 200) {
      return {
        success: true,
        message: "Equipamento editado com sucesso",
      };
    }

    if (response.statusCode === 404) {
      return {
        success: false,
        message: "Equipamento não encontrado",
      };
    }

    return {
      success: false,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao editar equipamento. Exceção: " + error,
    };
  }
}
