import {
	AttentionFilters,
	DatesAndIdVaParams,
	DatesChannelsAndVA,
	ExperienceFilters,
	TMOFilters,
} from '@/types/Indicators'
import { orchestratorWithAuthClient } from '../utilities/instances'

// FCR
export async function getFCR(filters: TMOFilters) {
	const response = await orchestratorWithAuthClient.get<number>(
		`/api/statistics/organization/${filters.idOrg}/interactions/fcr`,
		{
			params: filters.payload,
		}
	)
	return response.data
}

// TMAsignacion
export async function getTMAsignacion(filters: TMOFilters) {
	const response = await orchestratorWithAuthClient.get<number>(
		`/api/statistics/organization/${filters.idOrg}/interactions/TMAsignacion`,
		{
			params: filters.payload,
		}
	)
	return response.data
}

// TMAtencionAH
export async function getTMAtencionAH(filters: TMOFilters) {
	const response = await orchestratorWithAuthClient.get<number>(
		`/api/statistics/organization/${filters.idOrg}/interactions/TMAtencionAH`,
		{
			params: filters.payload,
		}
	)
	return response.data
}

// TMAtencionAV
export async function getTMAtencionAV(filters: TMOFilters) {
	const response = await orchestratorWithAuthClient.get<number>(
		`/api/statistics/organization/${filters.idOrg}/interactions/TMAtencionAV`,
		{
			params: filters.payload,
		}
	)
	return response.data
}

export async function getTMO(filters: TMOFilters) {
	const response = await orchestratorWithAuthClient.get<number>(
		`/api/statistics/organization/${filters.idOrg}/interactions/TMO`,
		{
			params: filters.payload,
		}
	)
	return response.data
}

// Porcentaje de chats atendidos
export async function getAttendedChats(filters: AttentionFilters) {
	const response = await orchestratorWithAuthClient.get<number | string>(
		`/api/statistics/organization/${filters.idOrg}/attention/agent/percentage/attended`,
		{
			params: filters.payload,
		}
	)
	return response.data
}

// Porcentaje de chats no atendidos
export async function getNotAttendedChats(filters: AttentionFilters) {
	const response = await orchestratorWithAuthClient.get<number>(
		`/api/statistics/organization/${filters.idOrg}/attention/agent/percentage/notAttended`,
		{
			params: filters.payload,
		}
	)
	return response.data
}

// Nivel de falta de respuesta del BOT
export async function getFaltaRespuestaBotApi(params: DatesAndIdVaParams) {
	const response = await orchestratorWithAuthClient.get<string>(
		`/api/statistics/organization/${params.idOrg}/interactions/missingBotResponse`,
		{
			params: params.payload,
		}
	)
	return response.data
}

// Nivel de abandono
export async function getNivelAbandonoApi(params: DatesChannelsAndVA) {
	const response = await orchestratorWithAuthClient.get<string>(
		`/api/statistics/organization/${params.idOrg}/attention/percentage/abandonmentLevel`,
		{
			params: params.payload,
		}
	)
	return response.data
}

// Nivel de satisfacción
export async function getNS(filters: ExperienceFilters) {
	const response = await orchestratorWithAuthClient.get<number>(
		`/api/statistics/organization/${filters.idOrg}/interactions/satisfaction`,
		{
			params: filters.payload,
		}
	)
	return response.data
}

// Recurrencia de usuarios
export async function getRU(filters: ExperienceFilters) {
	const response = await orchestratorWithAuthClient.get<number>(
		`/api/statistics/organization/${filters.idOrg}/entries_clients/recurring_clients`,
		{
			params: filters.payload,
		}
	)
	return response.data
}

// Net promote score
export async function getNPS(filters: ExperienceFilters) {
	const response = await orchestratorWithAuthClient.get<number>(
		`/api/experience/organization/${filters.idOrg}/agent/calculateNetPromoterScore`,
		{
			params: filters.payload,
		}
	)
	return response.data
}
