"use server";

import { api } from "@/lib/axios";
import {
  NewRateSchema,
  NewRateSchemaType,
  IntervalRateSchema,
  IntervalRateSchemaType,
} from "@/schemas/new-rates.schema";
import { cookies } from "next/headers";

export interface NewRateDataType {
  cod_concessionaria: string;
  dt_tarifa: Date;
  subgrupo: string;
  valor: number;
  intervalos_tarifas: IntervalRateSchemaType;
}

export async function newRateAction(
  formData: NewRateSchemaType,
  cod_concessionaria: string
): Promise<{ success: boolean; message: string }> {
  try {
    const token = cookies().get("token")?.value;
    const parsedData: NewRateDataType = {
      cod_concessionaria: cod_concessionaria,
      dt_tarifa: formData.dt_tarifa,
      subgrupo: formData.subgrupo,
      valor: formData.valor,
      intervalos_tarifas: formData.intervalos_tarifas,
    };

    const response = await api
      .post("/rates", parsedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response)
      .catch((error) => error.response.data);

    if (response.status === 201) {
      return {
        success: true,
        message: "Tarifa criada com sucesso",
      };
    }

    if (response.status === 400) {
      return {
        success: false,
        message: "Pelo menos um Intervalo deve ser fornecido",
      };
    }

    if (response.status === 404) {
      return {
        success: false,
        message: "A concessionária não foi encontrada",
      };
    }

    return {
      success: false,
      message: response.message,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Erro ao criar tarifa. Exceção " + error,
    };
  }
}
