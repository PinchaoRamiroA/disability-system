import {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
} from 'axios'
import {
	ACCESS_TOKEN_NAME,
	REFRESH_TOKEN_NAME,
} from '@/utils/constants/userSession'
import { refreshToken } from '../authentication'
import { autoLogOut, cleanLocalStorage } from '@/utils/helpers/autoLogOut'
import { saveAuthToken } from '@/utils/helpers/accessToken'
import store from '@/store/index'
import { clearDispatchActions } from '@/store/slices/authentication'
import { AnyAction } from '@reduxjs/toolkit'

let isRefreshTokenFetching = false

const requireAuth = (config: AxiosRequestConfig): AxiosRequestConfig => {
	if (config.headers === undefined) {
		config.headers = {}
	}
	config.headers['Authorization'] = `Bearer ${localStorage.getItem(
		ACCESS_TOKEN_NAME
	)}`

	return config
}

const requireRefresh = (config: AxiosRequestConfig): AxiosRequestConfig => {
	if (config.headers === undefined) {
		config.headers = {}
	}
	config.headers['Authorization'] = `Bearer ${localStorage.getItem(
		REFRESH_TOKEN_NAME
	)}`

	return config
}

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
	// console.info(`[request] [${JSON.stringify(config)}]`)
	return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
	// console.log('ERRER', error.config)
	// console.error(`[request error] [${JSON.stringify(error)}]`)
	return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
	// console.info(`[response] [${JSON.stringify(response)}]`)
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

			// console.log('CHECKING RESPONSE STATUS', err.response?.status)

			if (originalConfig.url !== '/api/auth' && err.response) {
				if (err.response.status === 401) {
					// console.log('REFRESH TOKEN')
					if (!isRefreshTokenFetching) {
						isRefreshTokenFetching = true

						refreshToken()
							.then(saveAuthToken)
							.then(() => {
								isRefreshTokenFetching = false

								// Despachar actions y ejecutar callbacks guardados antes del refresco
								const { actions, callbacks } =
									store.getState().redispatch

								actions.forEach((action) =>
									store.dispatch(action as AnyAction)
								)
								callbacks.forEach((callback) => callback())

								// Limpiar state de actions y callbacks
								store.dispatch(clearDispatchActions())

								// Reiniciar cierre automático
								autoLogOut()
							})
							.catch(() => {
								// console.log('ERROR, REDIRIGIR A LOGIN')
								cleanLocalStorage()
								window.location.href = window.location.origin
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
		axiosInstance.interceptors.request.use(requireRefresh, onRequestError)
	} else {
		axiosInstance.interceptors.request.use(requireAuth, onRequestError)
	}
	return axiosInstance
}
