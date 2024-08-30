import { Concessionaire } from "./concessionaire";
import { Equipments } from "./equipments";

export interface ConsumerUnit {
  cod_unidade_consumidora: string;
  cidade: string;
  uf: string;
  numero: string;
  subgrupo: string;
  criadoEm: Date;
  atualizadoEm: Date;
  equipamentos: Equipments[];
  cod_concessionaria: string;
  concessionaria: Concessionaire
  cod_criador: string;
  cod_usuario: string;
}
