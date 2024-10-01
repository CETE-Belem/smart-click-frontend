"use server";

import { api } from "@/lib/axios";
import { cookies } from "next/headers";
import { Rates } from "@/types/rates";

export async function getRateAction(id: string): Promise<Rates> {
  const token = cookies().get("token")?.value;
  const response = await api.get(`/rates/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
