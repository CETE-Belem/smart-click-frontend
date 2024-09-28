import { z } from "zod";

export const LinkConsumerUnitSchema = z.object({
    number: z
        .string({
            required_error: "Campo obrigatório",
        })
        .min(
            8, "O número da unidade consumidora é obrigatório e deve conter no mínimo 8 dígitos"
        )
        .max(
            8, "O número da unidade consumidora deve conter no máximo 8 dígitos"
        )
        .regex(/^\d+$/, "O número de unidade consumidora deve conter apenas números"),
});

export type LinkConsumerUnitSchemaType = z.infer<typeof LinkConsumerUnitSchema>;