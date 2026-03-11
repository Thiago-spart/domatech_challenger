"use client";

import * as React from "react";
import { Button } from "@/components/action/Button";
import { Input } from "@/components/action/Input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/Dialog";
import { Drawer, DrawerContent, DrawerClose } from "@/components/Drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { XIcon } from "lucide-react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import styles from "./style.module.sass";
import { Controller, useForm } from "react-hook-form";
import { PatientSchema, patientSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/action/Field";
import Select from "@/components/action/Select";
import CountrySelect from "@/components/action/CountrySelect";
import pt from "react-phone-number-input/locale/pt.json";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { createPatient, CreatePatientParams, CreatePatientResponse } from "@/app/home/actions";
import { toast } from "sonner";

interface ResponsiveUserDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const genreOptions = [
  { label: "Selecione", value: "" },
  { label: "Masculino", value: "MALE" },
  { label: "Feminino", value: "FEMALE" },
];

export interface ZipCodeData {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

const fetchZipCodeData = async (zipCode: string): Promise<ZipCodeData> => {
  const response = await axios.get<ZipCodeData>(
    `https://viacep.com.br/ws/${zipCode}/json/`,
  );

  return response.data;
};

export function ResponsiveUserDrawer({
  open,
  setOpen,
}: ResponsiveUserDrawerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [tab, setTab] = React.useState<"basic" | "others">("basic");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(patientSchema),
    mode: "onChange",
    defaultValues: {
      tags: 'test'
    }
  });

  const { mutate: fetchZipCode } = useMutation({
    mutationFn: fetchZipCodeData,
    onSuccess: (data) => {
      setValue("addresses.street", data.logradouro);
      setValue("addresses.neighborhood", data.bairro);
      setValue("addresses.city", data.localidade);
      setValue("addresses.cityCodeIbge", data.estado);
    },
  });

  const onBlurGetAddress = async (zipCode: string) => {
    const cleanedZip = zipCode.replace(/\D/g, "");

    if (cleanedZip.length !== 8) return;

    fetchZipCode(cleanedZip);
  };

  const onSubmit = async (data: PatientSchema) => {
    try {
      const formattedData: any = {
        fullName: data.fullName,
        genre: data.genre,
        bornDate: data.bornDate,
        phones: data.phone ? [
          {
            countryCode: data.phone.startsWith("+") ? data.phone.substring(0, 3) : "+55",
            number: data.phone.startsWith("+") ? data.phone.substring(3).replace(/\D/g, "") : data.phone.replace(/\D/g, ""),
          }
        ] : [],
        socialId: data.socialId || undefined,
        email: data.email || undefined,
        addresses: data?.addresses?.zipCode ? [
          {
            zipCode: data.addresses.zipCode.replace(/\D/g, ""),
            city: "673f8c5da9dc088d776a2b4d", // NOTE: Needs proper ObjectId mapping. Temporarily hardcoded for the test based on provided example.
            code: data.addresses.cityCodeIbge || "",
            neighborhood: data.addresses.neighborhood || "",
            street: data.addresses.street || "",
            number: data.addresses.number || "S/N",
            complement: data.addresses.complement || "",
          }
        ] : [],
      };

      await createPatient(formattedData);

      toast.success("Paciente cadastrado com sucesso!");
      setOpen(false);
      reset();
    } catch (error) {
      toast.error("Erro ao cadastrar paciente, tente mais tarde novamente.");
    }
  };

  const tabsContent = (
    <div className={styles.tabsContainer}>
      <button
        type="button"
        className={`${styles.tabButton} ${tab === "basic" ? styles.tabActive : ""}`}
        onClick={() => setTab("basic")}
      >
        Dados básicos
      </button>
      <button
        type="button"
        className={`${styles.tabButton} ${tab === "others" ? styles.tabActive : ""}`}
        onClick={() => setTab("others")}
      >
        Outros dados
      </button>
    </div>
  );

  const basicForm = (
    <div className={styles.formContent} style={{ display: tab === "basic" ? "flex" : "none" }}>
      <Field>
        <FieldLabel htmlFor="fullName">Nome completo*</FieldLabel>
        <Input
          placeholder="Nome completo*"
          id="fullName"
          error={!!errors.fullName}
          disabled={isSubmitting}
          {...register("fullName")}
        />
        <FieldError>{errors.fullName?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="genre">Gênero*</FieldLabel>
        <Select
          {...register("genre")}
          options={genreOptions}
          defaultValue={genreOptions[0].value}
          disabled={isSubmitting}
          error={!!errors.genre}
        />
        <FieldError>{errors.genre?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel htmlFor="bornDate">Data de nascimento*</FieldLabel>
        <Input
          type="date"
          placeholder="Data de nascimento*"
          id="bornDate"
          error={!!errors.bornDate}
          disabled={isSubmitting}
          {...register("bornDate")}
        />
        <FieldError>{errors.bornDate?.message}</FieldError>
      </Field>

      <Field className={styles.phoneField}>
        <FieldLabel htmlFor="phone">Celular do paciente*</FieldLabel>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              {...field}
              id="phone"
              className={styles.phoneInput}
              defaultCountry="BR"
              autoComplete="tel"
              placeholder=" "
              disabled={isSubmitting}
              inputComponent={Input}
              countrySelectComponent={CountrySelect}
              countrySelectProps={{ labels: pt }}
              error={!!errors.phone?.message}
            />
          )}
        />
        <FieldError>{errors.phone?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>E-mail de contato*</FieldLabel>
        <Input
          type="email"
          placeholder="E-mail de contato*"
          disabled={isSubmitting}
          id="email"
          {...register("email")}
        />
        <FieldError>{errors.email?.message}</FieldError>
      </Field>
    </div>
  );

  const othersForm = (
    <div className={styles.formContent} style={{ display: tab === "others" ? "flex" : "none" }}>
      <Field>
        <FieldLabel htmlFor="socialId">CPF ou CNPJ</FieldLabel>
        <Input
          placeholder="CPF ou CNPJ"
          id="socialId"
          error={!!errors.socialId}
          disabled={isSubmitting}
          maxLength={18}
          {...register("socialId", {
            onChange: e => {
              let value = e.target.value.replace(/\D/g, "");
              if (value.length <= 11) {
                value = value
                  .replace(/(\d{3})(\d)/, "$1.$2")
                  .replace(/(\d{3})(\d)/, "$1.$2")
                  .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
              } else {
                value = value
                  .replace(/^(\d{2})(\d)/, "$1.$2")
                  .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                  .replace(/\.(\d{3})(\d)/, ".$1/$2")
                  .replace(/(\d{4})(\d)/, "$1-$2")
                  .substring(0, 18);
              }
              e.target.value = value;
            },
          })}
        />

        <FieldError>{errors.socialId?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="zipCode">CEP</FieldLabel>
        <Input
          placeholder="CEP"
          id="zipCode"
          error={!!errors.addresses?.zipCode?.message}
          disabled={isSubmitting}
          {...register("addresses.zipCode", {
            onChange: e => {
              const value = e.target.value.replace(/\D/g, "").substring(0, 8);
              e.target.value = value.replace(/(\d{5})(\d)/, "$1-$2");
            },
            onBlur: e => onBlurGetAddress(e.target.value),
          })}
        />
        <FieldError>{errors.addresses?.zipCode?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="state">Estado</FieldLabel>
        <Input
          id="state"
          placeholder="Estado"
          isLoading={false}
          disabled
          error={!!errors.addresses?.cityCodeIbge?.message}
          {...register("addresses.cityCodeIbge")}
        />
        <FieldError>{errors.addresses?.cityCodeIbge?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="city">Cidade</FieldLabel>
        <Input
          id="city"
          placeholder="Cidade"
          isLoading={false}
          disabled
          error={!!errors.addresses?.city?.message}
          {...register("addresses.city")}
        />
        <FieldError>{errors.addresses?.city?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="neighborhood">Bairro</FieldLabel>
        <Input
          id="neighborhood"
          placeholder="Bairro"
          disabled
          error={!!errors.addresses?.neighborhood?.message}
          isLoading={false}
          {...register("addresses.neighborhood")}
        />
        <FieldError>{errors.addresses?.neighborhood?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="street">Rua</FieldLabel>
        <Input
          id="street"
          placeholder="Rua"
          disabled
          isLoading={false}
          error={!!errors.addresses?.street?.message}
          {...register("addresses.street")}
        />
        <FieldError>{errors.addresses?.street?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="number">Nº</FieldLabel>
        <Input
          id="number"
          placeholder="Nº"
          disabled={isSubmitting}
          isLoading={false}
          error={!!errors.addresses?.number?.message}
          {...register("addresses.number")}
        />
        <FieldError>{errors.addresses?.number?.message}</FieldError>
      </Field>
    </div>
  );

  const headerContent = (
    <div className={styles.drawerTopHeader}>
      <DialogTitle className={styles.headerTitle}>
        Adicionar paciente
      </DialogTitle>
      {isDesktop ? (
        <DialogClose asChild>
          <button type="button" className={styles.closeBtn}>
            <XIcon size={20} />
          </button>
        </DialogClose>
      ) : (
        <DrawerClose asChild>
          <button type="button" className={styles.closeBtn}>
            <XIcon size={20} />
          </button>
        </DrawerClose>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={styles.desktopDialogContent}
          showCloseButton={false}
        >
          {headerContent}
          <div className={styles.scrollableContent}>
            {tabsContent}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.formWrapper}
              id="form"
            >
              {basicForm}
              {othersForm}
            </form>
          </div>
          <div className={styles.footer}>
            <Button
              type="submit"
              form="form"
              className={styles.submitBtn}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Cadastrar paciente
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className={styles.mobileDrawerContent}>
        {headerContent}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.scrollableContentMobile}
          id="form"
        >
          {tabsContent}
          {basicForm}
          {othersForm}
        </form>
        <div className={styles.footer}>
          <Button
            type="submit"
            form="form"
            className={styles.submitBtn}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Cadastrar paciente
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
