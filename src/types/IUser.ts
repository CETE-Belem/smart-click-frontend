import { Role } from "@/enums/Role.enum";

export interface IUser {
  cod_usuario: string;
  nome: string;
  email: string;
  perfil: Role;
  contaConfirmada: boolean;
  criadoEm: string;
  atualizadoEm: string;
}
