import axios, { AxiosInstance } from 'axios'
import {
	setupAuthInterceptorTo,
	setupLoggingInterceptorsTo,
} from './interceptors'

export const createAxiosInstance = (
	baseURL: string,
	requireAuth: boolean,
	refresh = false
): AxiosInstance => {
	const axiosClient = axios.create({
		baseURL,
		headers: { 'Content-Type': 'application/json' },
	})

	// if (process.env.NODE_ENV !== 'production') {
	// }
	setupLoggingInterceptorsTo(axiosClient)

	if (requireAuth) {
		setupAuthInterceptorTo(axiosClient, refresh)
	}
	return axiosClient
}
