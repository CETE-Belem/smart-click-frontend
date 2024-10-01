"use server";

import { api } from "@/lib/axios";
import { cookies } from "next/headers";
import { Rates } from "@/types/rates";

export interface GetRateResponse {
  rate: Rates;
}

export async function getRateAction(id: string): Promise<GetRateResponse | any > {
  const token = cookies().get("token")?.value;
  const data = await api.get<GetRateResponse>(`/rates/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}
