import z from "zod";
import {
  maxEmailLength,
  maxNameLength,
  maxPasswordLength,
  minPasswordLength,
  passwordRegex,
} from "@/constants/auth";

export const editProfileSchema = z
  .object({
    email: z
      .string()
      .email("E-mail inválido")
      .min(1, "O e-mail é obrigatório")
      .max(
        maxEmailLength,
        `O e-mail deve ter no máximo ${maxEmailLength} caracteres`
      ),
    password: z
      .string({
        message: "Senha obrigatória",
      })
      .regex(
        passwordRegex,
        "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial"
      )
      .min(
        minPasswordLength,
        `A senha deve ter no mínimo ${minPasswordLength} caracteres`
      )
      .max(
        maxPasswordLength,
        `A senha deve ter no máximo ${maxPasswordLength} caracteres`
      ),
    confirmPassword: z.string({
      message: "Confirme sua senha",
    }),
    nome: z
      .string()
      .min(1, "O nome é obrigatório")
      .max(
        maxNameLength,
        `O nome deve ter no máximo ${maxNameLength} caracteres`
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type editProfileSchemaType = z.infer<typeof editProfileSchema>;

export const editProfileSchemaTransformed = editProfileSchema.transform(
  ({ confirmPassword, ...data }) => data
);
