"use server";

import { api } from '@/lib/axios';
import { ConsumerUnit } from '@/types/unidade-consumidora'
import { cookies } from 'next/headers';

export interface GetConsumerUnitResponse {
    consumerUnits: ConsumerUnit;
}

export async function getConsumerUnitAction(
    id: string
): Promise<GetConsumerUnitResponse | any> {
    const token = cookies().get("token")?.value;
    const data = await api.get<GetConsumerUnitResponse>(
        `/consumer-units/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }
    );
    return data;
}