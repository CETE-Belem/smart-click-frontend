import { api } from "@/lib/axios";
import { Rates } from "@/types/rates";
import { cookies } from "next/headers";

export interface GetRatesResponse {
  rates: Rates[];
  totalRates: number;
  limit: number;
  page: number;
  totalPages: number;
}

export async function getRatesAction(page: number, limit: number): Promise<GetRatesResponse | any > {
  const token = cookies().get("token")?.value;
  const data = await api.get<GetRatesResponse>(
    `/rates?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
}