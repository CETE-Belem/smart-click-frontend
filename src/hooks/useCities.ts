import { ICity } from "../types/ICity";
import { useState, useEffect } from "react";

type CitiesOptions = {
  /**
   * Fetch all cities
   * @default true
   */
  fetchAll?: boolean;
  ufId?: number | null;
  orderBy?: "ASC" | "DESC";
};

export default function useCities(options?: CitiesOptions) {
  const { fetchAll = true, ufId, orderBy = "ASC" } = options || {};
  const [cities, setCities] = useState<ICity[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (fetchAll) {
      fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios")
        .then((response) => response.json())
        .then((data) => setCities(data))
        .finally(() => setLoading(false));
    } else if (ufId) {
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios`
      )
        .then((response) => response.json())
        .then((data) => {
          if (orderBy === "DESC") {
            data.reverse();
          }
          setCities(data);
        })
        .finally(() => setLoading(false));
    }
  }, [fetchAll, orderBy, ufId]);

  return { cities, loading };
}
