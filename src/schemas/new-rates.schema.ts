import { convertTimeToMinutes } from "@/lib/utils";
import dayjs from "dayjs";
import { z } from "zod";

export const IntervalRateSchema = z.array(
  z.object({
    de: z
      .string()
      .nullable()
      .refine(
        (value) => value === null || dayjs(value, "HH:mm", true).isValid(),
        "Formato de hora inválido"
      )
      .transform((value) => {
        if (value === null) {
          return null;
        }
        return convertTimeToMinutes(value, "HH:mm");
      }),
    ate: z
      .string()
      .nullable()
      .refine(
        (value) => value === null || dayjs(value, "HH:mm", true).isValid(),
        "Formato de hora inválido"
      )
      .transform((value) => {
        if (value === null) {
          return null;
        }
        return convertTimeToMinutes(value, "HH:mm");
      }),
    valor: z
      .number({
        required_error: "O valor é obrigatório",
      })
      .nullable(),
    tipo: z.string().nullable(),
  })
);

export const NewRateSchema = z.object({
  cod_concessionaria: z.string().optional(),
  dt_tarifa: z.date({
    required_error: "A data é obrigatória",
  }),
  subgrupo: z.string({
    required_error: "Subgrupo é obrigatório",
  }),
  valor: z.number({
    required_error: "O valor é obrigatório",
  }),
  intervalos_tarifas: IntervalRateSchema,
});

export type IntervalRateSchemaType = z.infer<typeof IntervalRateSchema>;
export type NewRateSchemaType = z.infer<typeof NewRateSchema>;
