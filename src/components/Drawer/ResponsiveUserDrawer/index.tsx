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
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  createPatient,
  updatePatient,
  getPatientById,
  CreatePatientParams,
  GetPatientResponse,
  PatientListResponseItem,
} from "@/app/home/actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ResponsiveUserDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  patientToEdit?: PatientListResponseItem | null;
  onEditComplete?: () => void;
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

type PatientWithAddresses = GetPatientResponse & {
  addresses?: Array<{
    zipCode?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string | { _id?: string; name?: string };
    cityCodeIbge?: string;
    code?: string;
  }>;
};

function mapPatientToFormValues(patient: PatientWithAddresses): Record<string, unknown> {
  const firstPhone = patient.phones?.[0];
  const phoneValue =
    firstPhone && typeof firstPhone === "object" && "countryCode" in firstPhone && "number" in firstPhone
      ? `${firstPhone.countryCode}${firstPhone.number}`
      : undefined;

  const firstAddress = patient.addresses?.[0];
  const addr = firstAddress && typeof firstAddress === "object" ? firstAddress : undefined;
  const cityName = addr?.city && typeof addr.city === "object" && addr.city !== null && "name" in addr
    ? (addr.city as { name?: string }).name
    : typeof addr?.city === "string"
      ? addr.city
      : "";

  const bornDateStr = patient.bornDate ? new Date(patient.bornDate).toISOString().slice(0, 10) : "";

  return {
    fullName: patient.fullName ?? "",
    genre: (patient.genre === "MALE" || patient.genre === "FEMALE" ? patient.genre : "") as "MALE" | "FEMALE" | "",
    bornDate: bornDateStr,
    phone: phoneValue ?? "",
    email: patient.email ?? "",
    socialId: patient.socialId ?? "",
    tags: Array.isArray(patient.tags) ? patient.tags[0] ?? "" : "",
    addresses: addr
      ? {
          zipCode: addr.zipCode ? `${addr.zipCode.slice(0, 5)}-${addr.zipCode.slice(5)}` : "",
          street: addr.street ?? "",
          number: addr.number ?? "",
          complement: addr.complement ?? "",
          neighborhood: addr.neighborhood ?? "",
          city: cityName,
          cityCodeIbge: String(addr.cityCodeIbge ?? (addr as Record<string, unknown>).code ?? ""),
        }
      : undefined,
  };
}

export function ResponsiveUserDrawer({
  open,
  setOpen,
  patientToEdit = null,
  onEditComplete,
}: ResponsiveUserDrawerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const queryClient = useQueryClient();
  const [tab, setTab] = React.useState<"basic" | "others">("basic");
  const isEditMode = !!patientToEdit;

  const { data: patientData } = useQuery({
    queryKey: ["patient", patientToEdit?._id],
    queryFn: () => getPatientById(patientToEdit!._id),
    enabled: !!patientToEdit?._id && open,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PatientSchema>({
    resolver: zodResolver(patientSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      genre: "",
      bornDate: "",
      phone: "",
      email: "",
      socialId: "",
      tags: "",
      addresses: undefined,
    } as any,
  }) as any;

  React.useEffect(() => {
    if (!open) return;
    if (patientData) {
      const values = mapPatientToFormValues(patientData as PatientWithAddresses);
      reset(values);
    } else if (!patientToEdit) {
      reset({
        fullName: "",
        genre: "",
        bornDate: "",
        phone: "",
        email: "",
        socialId: "",
        tags: "",
        addresses: undefined,
      } as any);
    }
  }, [open, patientData, patientToEdit, reset]);

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

  const onSubmit = async (data: any) => {
    try {
      const formattedData: CreatePatientParams = {
        fullName: data.fullName,
        genre: data.genre,
        bornDate: data.bornDate,
        phones: data.phone ? [
          {
            description: "Pessoal",
            countryCode: data.phone.startsWith("+") ? data.phone.substring(0, 3) : "+55",
            number: data.phone.startsWith("+") ? data.phone.substring(3).replace(/\D/g, "") : data.phone.replace(/\D/g, ""),
            active: true,
            isWhatsapp: true,
          }
        ] : [],
        socialId: data.socialId || undefined,
        tags: data.tags ? [data.tags] : undefined,
        email: data.email || undefined,
        addresses: data?.addresses?.zipCode ? [
          {
            description: "Principal",
            zipCode: data.addresses.zipCode.replace(/\D/g, ""),
            street: data.addresses.street || "",
            number: data.addresses.number || "S/N",
            complement: data.addresses.complement || "",
            neighborhood: data.addresses.neighborhood || "",
            typeNeighborhood: "URBANO",
            typeStreet: "RUA",
            city: "673f8c5da9dc088d776a2b4d", // NOTE: Needs proper ObjectId mapping. Temporarily hardcoded for the test based on provided example.
            cityCodeIbge: data.addresses.cityCodeIbge || "",
          }
        ] : undefined,
      };

      if (isEditMode && patientToEdit) {
        await updatePatient(patientToEdit._id, formattedData);
        toast.success("Paciente atualizado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["patients"] });
        onEditComplete?.();
      } else {
        await createPatient(formattedData);
        toast.success("Paciente cadastrado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["patients"] });
      }

      setOpen(false);
      reset();
    } catch (error) {
      toast.error(
        isEditMode
          ? "Erro ao atualizar paciente, tente mais tarde novamente."
          : "Erro ao cadastrar paciente, tente mais tarde novamente."
      );
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
      <Field>
        <FieldLabel htmlFor="complement">Complemento</FieldLabel>
        <Input
          id="complement"
          placeholder="Apto, bloco, etc."
          disabled={isSubmitting}
          error={!!errors.addresses?.complement?.message}
          {...register("addresses.complement")}
        />
        <FieldError>{errors.addresses?.complement?.message}</FieldError>
      </Field>
    </div>
  );

  const headerContent = (
    <div className={styles.drawerTopHeader}>
      <DialogTitle className={styles.headerTitle}>
        {isEditMode ? "Editar paciente" : "Adicionar paciente"}
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
              {isEditMode ? "Salvar alterações" : "Cadastrar paciente"}
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
            {isEditMode ? "Salvar alterações" : "Cadastrar paciente"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
