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
  intervalos_tarifas: IntervalRateSchemaType[];
}

export async function newRateAction(
  formData: NewRateSchemaType,
  cod_concessionaria: string
): Promise<{ sucess: boolean; message: string }> {
    console.log(formData);
  try {

    const resultInterval = IntervalRateSchema.safeParse(formData.intervalos_tarifas);
    const newFormDataInterval = resultInterval.data!;

    const result = NewRateSchema.safeParse(formData);
    const newFormData = result.data!;
    const token = cookies().get("token")?.value;
    const parsedData: NewRateDataType = {
        cod_concessionaria: cod_concessionaria,
        dt_tarifa: newFormData?.dt_tarifa,
        subgrupo: newFormData.subgrupo,
        valor: newFormData.valor,
        intervalos_tarifas: [newFormDataInterval],
    };

    
    const response = await api
    .post("/rates", parsedData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    .then((response) => response)
    .catch((error) => error.response.data);
    
    console.log(response);

    if (response.status === 200) {
      return {
        sucess: true,
        message: "Tarifa criada com sucesso",
      };
    }

    if (response.status === 400) {
      return {
        sucess: false,
        message: "Pelo menos um Intervalo deve ser fornecido",
      };
    }

    if (response.status === 404) {
      return {
        sucess: false,
        message: "A concessionária não foi encontrada",
      };
    }

    return {
      sucess: false,
      message: response.message,
    };
  } catch (error) {
    console.log(error);
    return {
      sucess: false,
      message: "Erro ao criar tarifa. Exceção " + error,
    };
  }
}
