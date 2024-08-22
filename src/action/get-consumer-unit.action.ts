"use server";

import { api } from '@/lib/axios';
import { ConsumerUnit } from '@/types/unidade-consumidora'
import { cookies } from 'next/headers';

export interface GetConsumerUnitResponse {
    limit: number;
    page: number;
    totalPages: number
    totalConsumerUnit: number;
    consumerUnit: ConsumerUnit[];
}

export async function getConsumerUnitAction(
    page:number,
    limit: number
): Promise<GetConsumerUnitResponse | any> {
    const token = cookies().get("token")?.value;
    const data = await api.get<GetConsumerUnitResponse>(
        `/consumer-unit?page=${page}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }
    );
    return data;
}