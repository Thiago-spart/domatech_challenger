"use server";

import { cookies } from "next/headers";
import { skydietAPI } from "@/services/skydietAPI";
import axios, { AxiosError } from "axios";

export interface CreatePatientPhone {
  description: string;
  countryCode: string;
  number: string;
  active: boolean;
  isWhatsapp: boolean;
}

export interface CreatePatientAddress {
  description: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  typeNeighborhood: string;
  typeStreet: string;
  city: string;
  cityCodeIbge?: string;
}

export interface CreatePatientParams {
  fullName: string;
  genre: "MALE" | "FEMALE" | string;
  bornDate: string;
  phones?: CreatePatientPhone[];
  socialId?: string;
  tags?: string[];
  addresses?: CreatePatientAddress[];
}

export interface PatientPhoneResponse extends CreatePatientPhone {
  createdAtDateTime: string;
  updatedAtDateTime: string;
}

export interface CreatePatientResponse {
  account: string;
  genre: string;
  fullName: string;
  bornDate: string;
  phones: PatientPhoneResponse[];
  socialId?: string;
  tags: string[];
  active: boolean;
  email?: string;
  sendEmailAsWelcome: boolean;
  _id: string;
  createdAtDateTime: string;
  updatedAtDateTime: string;
  __v: number;
  message: string;
}

export interface UpdatePatientParams extends Partial<CreatePatientParams> { }

export interface UpdatePatientResponse extends CreatePatientResponse { }

export interface PatientListResponseItem {
  _id: string;
  account: string;
  fullName: string;
  socialId: string;
  genre: string;
  bornDate: string;
  phones: (string | PatientPhoneResponse)[];
  email?: string;
  sendEmailAsWelcome?: boolean;
  createdAtDateTime: string;
  updatedAtDateTime: string;
  __v: number;
  user?: string;
  active: boolean;
  tags?: string[];
  identity?: string;
}

export interface PatientListResponse {
  items: PatientListResponseItem[];
  paging: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
  };
}

export interface DeletePatientResponse {
  message: string;
}

export type GetPatientResponse = Omit<CreatePatientResponse, "message">;

export async function createPatient(
  data: CreatePatientParams,
): Promise<CreatePatientResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("domatechUser")?.value;

  if (!token) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await skydietAPI.post<CreatePatientResponse>(
      "/clinical/patient",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to create patient:",
      error?.response?.data || error.message,
    );
    throw new Error(
      error?.response?.data?.message || "Failed to create patient",
    );
  }
}

export async function updatePatient(
  id: string,
  data: UpdatePatientParams,
): Promise<UpdatePatientResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("domatechUser")?.value;

  if (!token) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await skydietAPI.patch<UpdatePatientResponse>(
      `/clinical/patient/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Failed to update patient ${id}:`,
      error?.response?.data || error.message,
    );
    throw new Error(
      error?.response?.data?.message || "Failed to update patient",
    );
  }
}

export async function getPatients(): Promise<PatientListResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("domatechUser")?.value;

  if (!token) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await skydietAPI.get<PatientListResponse>(
      "/clinical/patient",
      {
        params: {
          populate: "addresses.city.state",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to get patients list:",
      error?.response?.data || error.message,
    );
    throw new Error(
      error?.response?.data?.message || "Failed to get patients list",
    );
  }
}

export async function getPatientById(id: string): Promise<GetPatientResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("domatechUser")?.value;

  if (!token) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await skydietAPI.get<GetPatientResponse>(
      `/clinical/patient/${id}`,
      {
        params: {
          populate: "addresses.city.state",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Failed to get patient ${id}:`,
      error?.response?.data || error.message,
    );
    throw new Error(error?.response?.data?.message || "Failed to get patient");
  }
}

export async function deletePatient(
  id: string,
): Promise<DeletePatientResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("domatechUser")?.value;

  if (!token) {
    throw new Error("User not authenticated");
  }

  try {
    const response = await skydietAPI.delete<DeletePatientResponse>(
      `/clinical/patient/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Failed to delete patient ${id}:`,
      error?.response?.data || error.message,
    );
    throw new Error(
      error?.response?.data?.message || "Failed to delete patient",
    );
  }
}

export async function getAddressByZipCode(zipCode: string): Promise<any> {
  try {
    const response = await axios.get(
      `https://viacep.com.br/ws/${zipCode}/json/`,
    );

    return response;
  } catch (error: AxiosError | any) {
    console.error(
      `Failed to get address by zip code ${zipCode}:`,
      error?.response?.data || error.message,
    );
    throw new Error(
      error?.response?.data?.message || "Failed to get address by zip code",
    );
  }
}
