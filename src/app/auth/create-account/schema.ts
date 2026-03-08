import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const createAccountSchema = z.object({
	name: z.string().trim().min(3, "Nome completo obrigatório").refine((name) => name.split(/\s+/).length >= 2, {
		message: "Digite seu nome completo",
	}),
	email: z.email("E-mail invalido"),
	password: z.string({ message: "Senha obrigatória" })
		.min(8, "A senha deve ter no mínimo 8 caracteres")
		.regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
		.regex(/[0-9]/, "A senha deve conter pelo menos um número")
		.regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
	passwordConfirmation: z.string({ message: "Confirmação de senha obrigatória" }),
	cpf: z.string().refine((cpf: string) => {
		if (typeof cpf !== "string") return false;
		cpf = cpf.replace(/[^\d]+/g, "");
		if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
		const cpfDigits = cpf.split("").map((el) => +el);
		const rest = (count: number): number => {
			return (((cpfDigits.slice(0, count - 12).reduce((soma, el, index) => soma + el * (count - index), 0) * 10) % 11) % 10);
		};
		return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
	}, "Digite um cpf válido."),
	phone: z.string({ message: "Telefone obrigatório" }).refine((val) => isValidPhoneNumber(val), "Telefone inválido"),
}).refine((data) => data.password === data.passwordConfirmation, {
	message: "As senhas não coincidem",
	path: ["passwordConfirmation"],
});

export type CreateAccountSchema = z.infer<typeof createAccountSchema>;