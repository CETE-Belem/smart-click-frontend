import { z } from "zod";

export const NewEquipmentSchema = z.object({
  name: z
    .string({
      required_error: "Campo obrigatório",
    })
    .min(
      2,
      "O nome do equipamento é obrigatório e deve conter no mínimo 2 caracteres"
    )
    .max(150, "O nome do equipamento deve ter no máximo 150 caracteres"),
  mac: z
    .string({
      required_error: "Campo obrigatório",
    })
    .min(17, "MAC inválido")
    .max(17, "MAC inválido"),
  consumerUnityNumber: z.string({
    required_error: "Campo obrigatório",
  }),
  description: z
    .string()
    .max(255, "A descrição deve ter no máximo 255 caracteres")
    .optional()
    .nullable(),
  city: z
    .string({
      required_error: "Campo obrigatório",
    })
    .max(255, "A cidade deve ter no máximo 255 caracteres"),
  uf: z
    .string({
      required_error: "Campo obrigatório",
    })
    .min(2, "UF deve ter no mínimo 2 caracteres")
    .max(2, "UF deve ter no máximo 2 caracteres"),
  monitoredPhases: z.enum(["MONOFASE", "BIFASE", "TRIFASE"], {
    message: "Fase inválida",
  }),
  ratedVoltage: z
    .string({
      required_error: "Campo obrigatório",
    })
    .refine((value) => {
      const number = Number(value);
      return number >= 0 && number <= 999;
    }, "Tensão inválida"),
});

export type NewEquipmentSchemaType = z.infer<typeof NewEquipmentSchema>;
