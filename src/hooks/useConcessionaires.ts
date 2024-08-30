import { GetConcessionairesResponse } from "@/action/get-concessionaires-action";
import { apiClient } from "@/lib/axios-client";
import { Concessionaire } from "@/types/concessionaire";
import { useState, useEffect, useMemo } from "react";

export default function useConcessionaires() {
    const [concessionaires, setConcessionaires] = useState<Concessionaire[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConcessionaires = async () => {
            try {
                const response = await apiClient.get<GetConcessionairesResponse>(`/concessionaires`);
                setConcessionaires(response.data.concessionaires);
            } catch (error) {
                setError(`Erro ao carregar as concessionárias. Erro: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchConcessionaires();
    }, []);

    const concessionaireOptions = useMemo(() => {
        return concessionaires.map(concessionaire => concessionaire.cod_concessionaria) as [string, ...string[]];
    }, [concessionaires]);

    return { concessionaires, concessionaireOptions, loading, error };
}