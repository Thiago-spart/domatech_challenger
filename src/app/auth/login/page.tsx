"use client";

import { Button } from "@/components/action/Button";
import styles from "./page.module.sass";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, loginSchema } from "./schema";
import { Input } from "@/components/action/Input";
import { Field, FieldError, FieldLabel } from "@/components/action/Field";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isReady, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema) => {
    console.log(data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Field>
        <FieldLabel htmlFor="email">E-mail</FieldLabel>

        <Input
          placeholder="E-mail"
          className={styles.input}
          required
          error={!!errors.email?.message}
          isLoading={false}
          {...register("email")}
        />

        <FieldError>{errors.email?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Senha</FieldLabel>

        <Input
          type="password"
          placeholder="Senha"
          className={styles.input}
          required
          {...register("password")}
        />

        <FieldError>{errors.password?.message}</FieldError>
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="sm"
        isLoading={false}
        disabled={!isReady || !isValid}
      >
        Entrar
      </Button>
    </form>
  );
}
