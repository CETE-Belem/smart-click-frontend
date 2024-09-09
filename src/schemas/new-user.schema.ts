import {z} from 'zod';
import { maxEmailLength, maxNameLength} from '@/constants/auth';

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

    role: z
        .string()
        .min(1, "O perfil é obrigatório")
        .max(20, "O perfil deve ter no máximo 20 caracteres"),
});

export type NewUserSchemaType = z.infer<typeof NewUserSchema>;