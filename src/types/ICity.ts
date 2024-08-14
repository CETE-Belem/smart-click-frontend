import { IUF } from "./IUF";

export interface ICity {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: IUF;
    };
  };
  "regiao-imediata": {
    id: number;
    nome: string;
    "regiao-intermediara": {
      id: number;
      nome: string;
      UF: IUF;
    };
  };
}
