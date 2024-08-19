import { useState, useEffect } from "react";
import { IUF } from "../types/IUF";

type UFsOptions = {
  orderBy?: "ASC" | "DESC";
};

const baseURL =
  "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome";

export default function useUFs(options?: UFsOptions) {
  const { orderBy = "ASC" } = options || {};
  const [loading, setLoading] = useState(false);

  const [ufs, setUfs] = useState<IUF[] | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${baseURL}&orderBy=${orderBy}`)
      .then((response) => response.json())
      .then((data) => {
        if (orderBy === "DESC") {
          data.reverse();
        }
        setUfs(data);
      })
      .finally(() => setLoading(false));
  }, [orderBy]);

  return { ufs, loading };
}
