import { z } from "zod";

export const NewEquipmentSchema = z.object({
  name: z
    .string()
    .min(
      2,
      "O nome do equipamento é obrigatório e deve conter no mínimo 2 caracteres"
    )
    .max(150, "O nome do equipamento deve ter no máximo 150 caracteres"),
  mac: z.string().min(17, "MAC inválido").max(17, "MAC inválido"),
  consumerUnityNumber: z.string(),
  description: z
    .string()
    .max(255, "A descrição deve ter no máximo 255 caracteres"),
  city: z.string().max(255, "A cidade deve ter no máximo 255 caracteres"),
  uf: z
    .string()
    .min(2, "UF deve ter no mínimo 2 caracteres")
    .max(2, "UF deve ter no máximo 2 caracteres"),
  monitoredPhases: z.enum(["MONOFASE", "BIFASE", "TRIFASE"], {
    message: "Fase inválida",
  }),
  ratedVoltage: z.number(),
});

export type NewEquipmentSchemaType = z.infer<typeof NewEquipmentSchema>;
