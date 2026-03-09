import axios from "axios";

export const skydietAPI = axios.create({
	baseURL: process.env.NEXT_PUBLIC_SKYDIET_API || "",
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	},
});