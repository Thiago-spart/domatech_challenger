'use server';

import { skydietAPI } from '@/services/skydietAPI';
import { cookies } from 'next/headers';

interface SigninData {
	email: string;
	password: string;
}

interface SigninResponse {
	access_token: string;
}

export async function loginAction(data: SigninData) {
	try {
		const response = await skydietAPI.post<SigninResponse>("/account/signin", {}, {
			auth: {
				username: data.email,
				password: data.password,
			},
		});


		const cookieStore = await cookies()

		cookieStore.set({
			name: 'domatechUser',
			value: response.data.access_token,
			httpOnly: true,
			secure: true,
			path: '/',
		})
	} catch (error) {
		console.log(error)
	}
}