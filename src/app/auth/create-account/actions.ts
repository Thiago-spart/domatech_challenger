'use server';

import { skydietAPI } from '@/services/skydietAPI';

interface Phone {
	description: string;
	countryCode: string;
	number: string;
	isWhatsApp: boolean;
}

interface SignUpData {
	nameResponsible: string;
	socialIdResponsible: string;
	phones: Phone[];
	email: string;
	password: string;
}

interface SignUpResponse {
	message: string;
}

export async function signUpAction(data: SignUpData) {
	const response = await skydietAPI.post<SignUpResponse>("/account/signup", {
		message: "test",
		origin: "PARCEIRO_1",
		...data
	}, {
		auth: {
			username: data.email,
			password: data.password,
		},
	});

	return response.data;
}