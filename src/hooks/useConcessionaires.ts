import { GetConcessionairesResponse } from "@/action/get-concessionaires-action";
import { apiClient } from "@/lib/axios-client";
import { Concessionaire } from "@/types/concessionaire";
import { useCookies } from "next-client-cookies";
import { useState, useEffect, useMemo } from "react";

export default function useConcessionaires() {
  const [concessionaires, setConcessionaires] = useState<Concessionaire[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const cookies = useCookies();

  useEffect(() => {
    const fetchConcessionaires = async () => {
      try {
        const token = cookies.get("token");
        const response = await apiClient.get<GetConcessionairesResponse>(
          `/concessionaires`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              limit: 1000,
              page: 1,
            },
          }
        );

        setConcessionaires(response.data.concessionaires);
      } catch (error: any) {
        setError(
          `Erro ao carregar as concessionárias. Erro: ${error.response.data.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConcessionaires();
  }, []);

  const concessionaireOptions = useMemo(() => {
    return concessionaires.map(
      (concessionaire) => concessionaire.cod_concessionaria
    ) as [string, ...string[]];
  }, [concessionaires]);

  return { concessionaires, concessionaireOptions, loading, error };
}
