import { z } from "zod";

export const loginSchema = z.object({
	email: z.email("E-mail obrigatório"),
	password: z.string("Senha obrigatória"),
});

export type LoginSchema = z.infer<typeof loginSchema>;