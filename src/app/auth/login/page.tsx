'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/action/Button';
import styles from './page.module.sass';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, loginSchema } from './schema';
import { Input } from '@/components/action/Input';
import { Label } from '@/components/Label';
import { Field, FieldError, FieldLabel } from '@/components/action/Field';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema) => {
    console.log(data);
  };

  return (
    <section className={styles.formSection}>
      <div className={styles.formWrapper}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo.svg"
            alt="Logo"
            width={70}
            height={125}
            className={styles.logo}
            priority
          />
        </div>

        <h1 className={styles.title}>Bem-vindo de volta!</h1>
        <p className={styles.subtitle}>Entre com:</p>

        <div className={styles.divider}>
          <span>ou acesse com seu e-mail:</span>
        </div>

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

          <Button type="submit" variant="primary" size="sm" isLoading={false}>
            Entrar
          </Button>
        </form>

        <div className={styles.signupText}>
          Não possui cadastro?{' '}
          <Link href="/auth/create-account" className={styles.signupLink}>
            Criar conta
          </Link>
        </div>
      </div>
    </section>
  );
}
