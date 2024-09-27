import {z} from "zod";

export const LinkConsumerUnitSchema = z.object({
    number: z
        .string({
            required_error: "Campo obrigatório",
        })
        .min(
            8, "O número da unidade consumidora é obrigatório e deve conter no mínimo 8 dígitos"
        )
        .max(
            8, "O número da unidade consumidora deve conter no mínimo 8 dígitos"
        ),
});

export type LinkConsumerUnitSchemaType = z.infer<typeof LinkConsumerUnitSchema>;