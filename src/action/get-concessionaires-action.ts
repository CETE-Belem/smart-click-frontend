'use server'

import { api } from "@/lib/axios"
import { Concessionaire } from "@/types/concessionaire"
import { cookies } from "next/headers"

export interface GetConcessionairesResponse {
    limit: number;
    page: number;
    totalPages: number;
    totalConcessionaires: number;
    concessionaires: Concessionaire[]
}

export async function GetConcessionairesAction(
    page: number,
    limit: number
): Promise<GetConcessionairesResponse | any> {
    const token = cookies().get("token")?.value
    const data = await api.get<GetConcessionairesResponse>(
        `/concessionaire?page=${page}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return data
}