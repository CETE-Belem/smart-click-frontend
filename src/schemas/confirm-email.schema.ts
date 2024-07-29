import z from "zod";

export const ConfirmEmail = z.object({
  code: z.string().min(1, "O código de verificação é obrigatório"),
});

export type ConfirmEmailType = z.infer<typeof ConfirmEmail>;
