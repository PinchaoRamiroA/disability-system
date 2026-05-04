import { createAxiosInstance } from './utils'

export const ORCH_BASE_URL = process.env.NEXT_PUBLIC_API_VIRTUAL_AGENT ?? ''
const H_AGENT_BASE_URL = process.env.NEXT_PUBLIC_API_HUMAN_AGENT ?? ''
const NOTI_BASE_URL = process.env.NEXT_PUBLIC_API_NOTIFICATIONS ?? ''

export const orchestratorClient = createAxiosInstance(ORCH_BASE_URL, false)
export const orchestratorWithAuthClient = createAxiosInstance(
	ORCH_BASE_URL,
	true
)
export const orchestratorClientRefresh = createAxiosInstance(
	ORCH_BASE_URL,
	true,
	true
)

export const humanAgentClient = createAxiosInstance(H_AGENT_BASE_URL, false)
export const humanlAgentWithAuthClient = createAxiosInstance(
	H_AGENT_BASE_URL,
	true
)
export const notificationsClient = createAxiosInstance(NOTI_BASE_URL, false)
export const notificationsWithAuthClient = createAxiosInstance(
	NOTI_BASE_URL,
	true
)
