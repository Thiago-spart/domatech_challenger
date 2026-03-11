import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

const validateCPF = (cpf: string) => {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  const cpfDigits = cpf.split("").map(el => +el);
  const rest = (count: number): number => {
    return (
      ((cpfDigits
        .slice(0, count - 12)
        .reduce((soma, el, index) => soma + el * (count - index), 0) *
        10) %
        11) %
      10
    );
  };
  return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
};

const validateCNPJ = (cnpj: string) => {
  cnpj = ["string", "number"].includes(typeof cnpj) ? `${cnpj}` : "";
  cnpj = cnpj.replace(/[^\d]+/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;
  const calcularDigito = (cnpj: string, posicoes: number) => {
    let soma = 0;
    let pos = posicoes - 7;
    for (let i = posicoes; i >= 1; i--) {
      soma += parseInt(cnpj.charAt(posicoes - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  const digito1 = calcularDigito(cnpj, 12);
  const digito2 = calcularDigito(cnpj, 13);
  return (
    digito1 === parseInt(cnpj.charAt(12)) &&
    digito2 === parseInt(cnpj.charAt(13))
  );
};

const validateDocument = (document: string) => {
  const digitsOnly = document.replace(/[^\d]+/g, "");
  if (digitsOnly.length > 11) {
    return validateCNPJ(digitsOnly);
  }
  return validateCPF(digitsOnly);
};

export const patientSchema = z.object({
  fullName: z.string().trim().min(3, "Nome completo obrigatório"),
  email: z.email("E-mail invalido"),
  phone: z
    .string({ message: "Telefone obrigatório" })
    .refine(val => isValidPhoneNumber(val), "Telefone inválido"),
  genre: z.enum(["MALE", "FEMALE"], "Gênero obrigatório"),
  bornDate: z.coerce.date("Data de nascimento inválida"),
  socialId: z
    .string()
    .refine(validateDocument, "Documento (CPF ou CNPJ) inválido")
    .optional(),
  tags: z.string().optional(),
  addresses: z
    .object({
      description: z.string().optional(),
      zipCode: z
        .string()
        .min(8, "CEP deve conter 8 dígitos")
        .max(9, "CEP deve conter 8 dígitos")
        .optional(),
      street: z.string().optional(),
      number: z.string().optional(),
      complement: z.string().optional(),
      neighborhood: z.string().optional(),
      typeNeighborhood: z.string().optional(),
      typeStreet: z.string().optional(),
      city: z.string().optional(),
      cityCodeIbge: z.string().optional(),
    })
    .optional(),
});

export type PatientSchema = z.infer<typeof patientSchema>;
