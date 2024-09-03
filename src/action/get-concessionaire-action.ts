"use server"

import { api } from "@/lib/axios"
import { Concessionaire } from "@/types/concessionaire"
import { cookies } from "next/headers"

export interface GetConcessionaireResponse {
    concessionaire: Concessionaire
}

export async function getConcessionaireAction(id:string): Promise<GetConcessionaireResponse| any> {
    const token = cookies().get("token")?.value
    const data = await api.get<GetConcessionaireResponse>(`/concessionaires/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data
}