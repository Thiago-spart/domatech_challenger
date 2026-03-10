"use client";

import { Button } from "@/components/action/Button";
import styles from "./page.module.sass";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, loginSchema } from "./schema";
import { Input } from "@/components/action/Input";
import { Field, FieldError, FieldLabel } from "@/components/action/Field";
import { loginAction } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isReady, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter()

  const handleRedirectToHome = () => {
    setTimeout(() => {
      router.replace('/home')
    }, 2000);
  }

  const onSubmit = async (data: LoginSchema) => {
    try {
      await loginAction(data)

      toast.success("Sendo redirecionado para home")
      handleRedirectToHome()
    } catch (error) {
      toast.error("Email ou senha incorretos, tente novamente")
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Field>
        <FieldLabel htmlFor="email">E-mail</FieldLabel>

        <Input
          placeholder="E-mail"
          className={styles.input}
          error={!!errors.email?.message}
          disabled={isSubmitting}
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
          disabled={isSubmitting}
          {...register("password")}
        />

        <FieldError>{errors.password?.message}</FieldError>
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="sm"
        isLoading={isSubmitting}
        disabled={!isReady || !isValid || isSubmitting}
      >
        Entrar
      </Button>
    </form>
  );
}
