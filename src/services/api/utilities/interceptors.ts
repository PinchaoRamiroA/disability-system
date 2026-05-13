import {
	AxiosError,
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios'
import { refreshToken } from '../authentication'
import { saveAuthToken } from '@/utils/helpers/accessToken'

const ACCESS_TOKEN_NAME = 'access_token'
const REFRESH_TOKEN_NAME = 'refresh_token'

let isRefreshTokenFetching = false

const requireAuth = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
	config.headers.set('Authorization', `Bearer ${localStorage.getItem(ACCESS_TOKEN_NAME)}`)
	return config
}

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
	return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
	return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
	return response
}

export function setupLoggingInterceptorsTo(
	axiosInstance: AxiosInstance
): AxiosInstance {
	axiosInstance.interceptors.request.use(onRequest, onRequestError)
	axiosInstance.interceptors.response.use(
		onResponse,
		async (err: AxiosError) => {
			const originalConfig = err.config

			if (originalConfig?.url !== '/api/auth' && err.response) {
				if (err.response.status === 401) {
					if (!isRefreshTokenFetching) {
						isRefreshTokenFetching = true

						refreshToken()
							.then(saveAuthToken)
							.then(() => {
								isRefreshTokenFetching = false
							})
							.catch(() => {
								localStorage.removeItem(ACCESS_TOKEN_NAME)
								localStorage.removeItem(REFRESH_TOKEN_NAME)
								window.location.href = '/login'
								return
							})
					}
				}
			}
			return Promise.reject(err)
		}
	)
	return axiosInstance
}

export function setupAuthInterceptorTo(
	axiosInstance: AxiosInstance,
	refresh: boolean
): AxiosInstance {
	if (refresh) {
		axiosInstance.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				config.headers.set('Authorization', `Bearer ${localStorage.getItem(REFRESH_TOKEN_NAME)}`)
				return config
			},
			onRequestError
		)
	} else {
		axiosInstance.interceptors.request.use(requireAuth, onRequestError)
	}
	return axiosInstance
}