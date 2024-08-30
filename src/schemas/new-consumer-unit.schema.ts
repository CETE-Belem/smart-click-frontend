import { z } from "zod";

export const NewConsumerUnitSchema = z.object({
    number: z
        .string({
            required_error: "Campo obrigatório",
        })
        .min(
            8, "O número da unidade consumidora é obrigatório e deve conter no mínimo 8 dígitos"
        )
        .max(8, "O número da unidade consumidora deve conter no mínimo 8 dígitos"),
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
        .min(2, "UF deve ter no máximo 2 caracteres"),
    cod_concessionaire: z.string({
        message: "Concessionária inválida",
    }),
    subGroup: z
        .string({
          required_error: "Campo obrigatório",
        })
        .min(1)
        .max(10, "O subgrupo deve ter no máximo 10 caracteres"),
    optanteTB: z.boolean({
        required_error: "Campo obrigatório"
    })
});

export type NewConsumerUnitSchemaType = z.infer<typeof NewConsumerUnitSchema>;