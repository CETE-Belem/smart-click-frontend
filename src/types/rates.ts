export type Rates = {
  cod_tarifa: string;
  dt_tarifa: string;
  valor: number;
  subgrupo: string;
  cod_concessionaria: string;
  criadoEm: string;
  atualizadoEm: string;
  intervalos_tarifas: IntervalosTarifa[];
};

export type IntervalosTarifa = {
  cod_intervalo_tarifa: string;
  de: number;
  ate: number;
  valor: number;
  tipo: string;
  cod_tarifa: string;
  criadoEm: string;
  atualizadoEm: string;
};
