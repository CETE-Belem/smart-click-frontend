import { z } from "zod";

export const NewUserSchema = z.object({
    name: z
        .string({
        required_error: "Campo obrigatório",
        })
        .min(
        2,
        "O nome do usuário é obrigatório e deve conter no mínimo 2 caracteres"
        )
        .max(150, "O nome do usuário deve ter no máximo 150 caracteres"),
    email: z
        .string({
            required_error: "Campo obrigatório",
        })
        .max(255, "O email deve ter no máximo 100 caracteres"),
    password: z
        .string({
            required_error: "Campo obrigatório",
        })
        .min(6, "Senha deve ter no mínimo 6 caracteres")
        .max(20, "Senha deve ter no máximo 50 caracteres"),
    consumerUnityNumber: z
        .string({
        required_error: "Campo obrigatório",
        })
        .min(
            8, "O número da unidade consumidora é obrigatório e deve conter no mínimo 8 dígitos"
        )
        .max(8, "O número da unidade consumidora deve conter no mínimo 8 dígitos"),
});

export type NewUserSchemaType = z.infer<typeof NewUserSchema>;