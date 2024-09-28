import { Rates } from "@/types/rates";

export interface GetRatesResponse {
  rates: Rates[];
  totalRates: number;
  limit: number;
  page: number;
  totalPages: number;
}
