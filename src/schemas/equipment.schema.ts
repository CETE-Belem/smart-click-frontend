import { z } from "zod";

export const EquipmentSchema = z.object({
  cod_concessionaria: z.string(),
  cod_equipamento: z.string(),
  cod_unidade_consumidora: z.string(),
  cod_usuario: z.string(),
  nome: z.string(),
  descricao: z.string(),
  mac: z.string(),
  criadoEm: z.string(),
  atualizadoEm: z.string(),
  tensao_nominal: z.number(),
  uf: z.string(),
  cidade: z.string(),
  fases_monitoradas: z.enum(["MONOFASE", "BIFASE", "TRIFASE"]),
  unidade_consumidora: z.string(),
  concessionaria: z.object({
    cod_concessionaria: z.string(),
    nome: z.string(),
    cidade: z.string(),
    uf: z.string(),
    cod_criador: z.string(),
    atualizadoEm: z.string(),
    criadoEm: z.string(),
  }),
});

export type EquipmentSchemaType = z.infer<typeof EquipmentSchema>;
