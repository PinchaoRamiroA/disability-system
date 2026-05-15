import { createAxiosInstance } from './utils'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

export const orchestratorClient = createAxiosInstance(API_URL, false)
export const orchestratorWithAuthClient = createAxiosInstance(
	API_URL,
	true
)
export const orchestratorClientRefresh = createAxiosInstance(
	API_URL,
	true,
	true
)

export const notificationsClient = createAxiosInstance(API_URL, false)
export const notificationsWithAuthClient = createAxiosInstance(
	API_URL,
	true
)
