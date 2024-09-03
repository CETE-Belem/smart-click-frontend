import { z } from "zod";

export const NewConcessionaireSchema = z.object({
    name: z
        .string({
        required_error: "Campo obrigatório",
        })
        .min(
        2,
        "O nome do equipamento é obrigatório e deve conter no mínimo 2 caracteres"
        )
        .max(150, "O nome do equipamento deve ter no máximo 150 caracteres"),
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
});

export type NewConcessionaireSchemaType = z.infer<typeof NewConcessionaireSchema>;