import { Concessionaire } from "./concessionaire";
import { ConsumerUnit } from "./unidade-consumidora";

export type Equipments = {
  cod_equipamento: string;
  cod_concessionaria: string;
  cod_unidade_consumidora: string;
  cod_usuario: string;
  nome: string;
  descricao: string;
  criadoEm: Date;
  atualizadoEm: Date;
  tensao_nominal: number;
  uf: string;
  cidade: string;
  subgrupo: string;
  fases_monitoradas: string;
  mac: string;
  unidade_consumidora: ConsumerUnit;
  concessionaria: Concessionaire;
};
