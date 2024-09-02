import { Concessionaire } from "./concessionaire";
import { Equipments } from "./equipments";

export interface ConsumerUnit {
  cod_unidade_consumidora: string;
  cidade: string;
  uf: string;
  cod_concessionaria: string;
  numero: string;
  cod_usuario: string;
  cod_criador: string;
  criadoEm: Date;
  atualizadoEm: Date;
  subgrupo: string;
  equipamentos: Equipments[];
  optanteTB: boolean
}
