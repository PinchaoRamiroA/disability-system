import {
	humanlAgentWithAuthClient,
	orchestratorWithAuthClient,
} from '@/services/api/utilities/instances'
import {
	Causal,
	CreateCausalBody,
	SaveCausalesNegocioBody,
	DeleteCausalFinBody,
	DeleteCausalNegocioBody,
	EstadisticaCausales,
	ReporteCausalesParams,
	UpdateCausalBody,
	SaveCausalFin,
	CausalesStatsParams,
	CSVReporteCausalesParams,
	ReporteCausalesDataRaw,
} from '@/types/Causales'
import { OrgAndIdva } from '@/types/OrgAndIdva'
import { IdOrgParam } from '@/types/auth'

// Obtener causales de negocio
export const getCausalesNegocio = async (params: IdOrgParam) => {
	const response = await humanlAgentWithAuthClient.get<Causal[]>(
		'/api/obtenerCausales',
		{ params }
	)

	return response.data
}

// Obtener causales de finalización
export const getCausalesFin = async (params: IdOrgParam) => {
	const response = await humanlAgentWithAuthClient.get<Causal[]>(
		'/api/causalesFinalizacion/obtenerCausalesFinalizacion',
		{ params }
	)

	return response.data
}

// Obtener causales de negocio activas
export const getCausalesNegocioActivas = async (params: OrgAndIdva) => {
	const response = await humanlAgentWithAuthClient.get<Causal[]>(
		'/api/obtenerCausalesActivos',
		{ params }
	)

	return response.data
}

// Obtener causales de finalización activas
export const getCausalesFinActivas = async (params: OrgAndIdva) => {
	const response = await humanlAgentWithAuthClient.get<Causal[]>(
		'/api/causalesFinalizacion/obtenerCausalesFinalizacionActivos',
		{ params }
	)

	return response.data
}

// Crear causal de negocio
export async function createCausalNegocio(params: Partial<CreateCausalBody>) {
	const response = await humanlAgentWithAuthClient.post<Causal>(
		'/api/crearCausal',
		params
	)

	return response.data
}

// Crear causal de finalización
export async function createCausalFin(params: Partial<CreateCausalBody>) {
	const response = await humanlAgentWithAuthClient.post<Causal>(
		'/api/causalesFinalizacion/crearCausalFinalizacion',
		params
	)

	return response.data
}

// Actualizar causal
export async function updateCausalNegocio(params: Partial<UpdateCausalBody>) {
	const response = await humanlAgentWithAuthClient.post<Causal>(
		'/api/actualizarCausal',
		params
	)

	return response.data
}

// Actualizar causal de finalización
export async function updateCausalFin(params: Partial<UpdateCausalBody>) {
	const response = await humanlAgentWithAuthClient.post<Causal>(
		'/api/causalesFinalizacion/actualizarCausalFinalizacion',
		params
	)

	return response.data
}

// Eliminar causal de negocio
export async function deleteCausalNegocio(params: DeleteCausalNegocioBody) {
	const response = await humanlAgentWithAuthClient.delete<boolean>(
		'/api/borrarCausal',
		{ params }
	)

	return response.data
}

// Eliminar causal de finalización
export async function deleteCausalFin(params: DeleteCausalFinBody) {
	const response = await humanlAgentWithAuthClient.delete<boolean>(
		'/api/causalesFinalizacion/borrarCausalFinalizacion',
		{ params }
	)

	return response.data
}

/**
 * Asesor humano
 */
// Guardar causal(es) de negocio
export const saveCausalesNegocio = async (params: SaveCausalesNegocioBody) => {
	const response = await humanlAgentWithAuthClient.post<string>(
		'/api/crearListadoCausalesConversacion',
		params
	)

	return response.data
}

// Guardar causal de finalización
export const saveCausalesFin = async (params: SaveCausalFin) => {
	const response = await humanlAgentWithAuthClient.post<string>(
		'/api/causalesFinalizacion/guardarCausalFinalizacionConversacion',
		params
	)

	return response.data
}

/**
 * Estadísticas
 */
// Obtener data para mostrar estadística de causales de negocio
export async function estadisticaCausalesNegocio(params: CausalesStatsParams) {
	const response = await orchestratorWithAuthClient.get<EstadisticaCausales>(
		`/api/statistics/organization/${params.idOrg}/attention/agent/businessCausals`,
		{ params: params.payload }
	)

	return response.data
}
// Obtener data para mostrar estadística de causales de finalización
export async function estadisticaCausalesFin(params: CausalesStatsParams) {
	const response = await orchestratorWithAuthClient.get<EstadisticaCausales>(
		`/api/statistics/organization/${params.idOrg}/attention/agent/finalCausals`,
		{ params: params.payload }
	)

	return response.data
}

/**
 * Reporte
 */
// Obtener data para previsualizar lo que se puede descargar
export async function reporteCausales(params: ReporteCausalesParams) {
	const response =
		await orchestratorWithAuthClient.get<ReporteCausalesDataRaw>(
			`/api/statistics/organization/${params.idOrg}/attention/agent/humanAgentTyping`,
			{ params: params.payload }
		)

	return response.data
}
// Obtener data del CSV para descargar el reporte de causales de negocio
export async function CSVReporteCausales(params: CSVReporteCausalesParams) {
	const response = await orchestratorWithAuthClient.get<string>(
		'/api/reports/humanAgentTyping',
		{ params }
	)

	return response.data
}
