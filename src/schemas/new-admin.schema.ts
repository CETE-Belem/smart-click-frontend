import { z } from "zod";
import { maxEmailLength, maxNameLength, minPasswordLength, maxPasswordLength, passwordRegex } from '@/constants/auth';

export const NewUserSchema = z.object({
    name: z
        .string()
        .min(1, "O nome é obrigatório")
        .max(maxNameLength, `O nome deve ter no máximo ${maxNameLength} caracteres`),

    email: z
        .string()
        .email("E-mail inválido")
        .min(1, "O e-mail é obrigatório")
        .max(maxEmailLength, `O e-mail deve ter no máximo ${maxEmailLength} caracteres`),

    password: z
        .string()
        .regex(passwordRegex, "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial")
        .min(minPasswordLength, `A senha deve ter no mínimo ${minPasswordLength} caracteres`)
        .max(maxPasswordLength, `A senha deve ter no máximo ${maxPasswordLength} caracteres`),
});

export type NewUserSchemaType = z.infer<typeof NewUserSchema>;