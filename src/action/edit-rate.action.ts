"use server";

import { api } from "@/lib/axios";
import {
  NewRateSchemaType,
} from "@/schemas/new-rates.schema";
import { NewRateDataType } from "./new-rate.action";
import { cookies } from "next/headers";

export async function editRateAction(
  formData: NewRateSchemaType,
    cod_concessionaria: string,
  cod_rate: string
): Promise<{ success: boolean; message: string }> {

  console.log(cod_concessionaria)
  console.log(cod_rate)

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
      .patch(`/rates/${cod_rate}`, parsedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response)
      .catch((error) => error.response.data);

      if(response.status === 200) {
        return {
          success: true,
          message: "Tarifa editada com sucesso",
        };
      }

      if(response.status === 400) {
        return {
          success: false,
          message: "Os intervalos não podem se sobrepor",
        };
      }

      if(response.status === 404) {
        return {
          success: false,
          message: "Tarifa não encontrada",
        };
      }

    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao editar a tarifa. Exceção: " + error,
    };
  }
}
