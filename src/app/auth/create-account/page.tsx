"use client";

import { Button } from "@/components/action/Button";
import styles from "./page.module.sass";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAccountSchema, createAccountSchema } from "./schema";
import { Input } from "@/components/action/Input";
import { Field, FieldError, FieldLabel } from "@/components/action/Field";
import PhoneInput from "react-phone-number-input/input";
import { formatCPFValue } from "../../../utils/cpfMask";

const CheckIcon = ({ checked }: { checked: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={`${styles.validationIcon} ${checked ? styles.validationIconValid : ""}`}
  >
    {checked ? (
      <>
        <circle
          cx="8"
          cy="8"
          r="7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M11.5 5.5L6.5 10.5L4.5 8.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1" />
    )}
  </svg>
);

export default function CreateAccountPage() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<CreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
    mode: "onChange",
  });

  const onSubmit = (data: CreateAccountSchema) => {
    console.log(data);
  };

  const password = watch("password") || "";

  const rules = [
    { label: "1 letra maiúscula", valid: /[A-Z]/.test(password) },
    { label: "1 número", valid: /[0-9]/.test(password) },
    { label: "1 caractere especial", valid: /[^A-Za-z0-9]/.test(password) },
    { label: "8 caracteres", valid: password.length >= 8 },
  ];

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.row}>
        <Field>
          <FieldLabel htmlFor="name">Nome completo*</FieldLabel>
          <Input
            id="name"
            autoComplete="name full-name"
            placeholder="Nome completo*"
            isLoading={false}
            disabled={false}
            error={!!errors.name?.message}
            {...register("name")}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="cpf">CPF*</FieldLabel>

          <Input
            id="cpf"
            inputMode="numeric"
            autoComplete="cpf"
            placeholder="CPF*"
            isLoading={false}
            disabled={false}
            error={!!errors.cpf?.message}
            {...register("cpf", {
              onChange: e => {
                const formattedValue = formatCPFValue(e.target.value);
                e.target.value = formattedValue;
              },
            })}
          />
          <FieldError>{errors.cpf?.message}</FieldError>
        </Field>
      </div>

      <div className={styles.row}>
        <Field>
          <FieldLabel htmlFor="phone">Telefone*</FieldLabel>

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                id="phone"
                country="BR"
                autoComplete="tel"
                placeholder="Telefone*"
                disabled={false}
                inputComponent={Input}
                error={!!errors.phone?.message}
              />
            )}
          />

          <FieldError>{errors.phone?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">E-mail*</FieldLabel>

          <Input
            id="email"
            inputMode="email"
            autoComplete="email"
            placeholder="E-mail*"
            isLoading={false}
            disabled={false}
            error={!!errors.email?.message}
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>
      </div>

      <div className={styles.row}>
        <Field>
          <FieldLabel htmlFor="password">Senha*</FieldLabel>

          <Input
            id="password"
            type="password"
            placeholder="Senha*"
            isLoading={false}
            disabled={false}
            error={!!errors.password?.message}
            {...register("password")}
          />

          <FieldError>{errors.password?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="passwordConfirmation">
            Confirmar senha*
          </FieldLabel>

          <Input
            id="passwordConfirmation"
            type="password"
            placeholder="Confirmar senha*"
            error={!!errors.passwordConfirmation?.message}
            isLoading={false}
            disabled={!password}
            {...register("passwordConfirmation")}
          />
          <FieldError>{errors.passwordConfirmation?.message}</FieldError>
        </Field>
      </div>

      <div className={styles.validationSection}>
        <p className={styles.validationTitle}>A senha deve ter pelo menos</p>
        <div className={styles.validationList}>
          {rules.map((rule, idx) => (
            <div key={idx} className={styles.validationItem}>
              <CheckIcon checked={rule.valid} />
              <span
                className={`${styles.validationText} ${rule.valid ? styles.validationTextValid : ""}`}
              >
                {rule.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={false}
        disabled={!isValid}
        style={{ marginTop: "16px" }}
      >
        Criar conta
      </Button>
    </form>
  );
}
