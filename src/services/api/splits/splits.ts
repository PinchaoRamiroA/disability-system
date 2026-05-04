import { humanlAgentWithAuthClient } from '@/services/api/utilities/instances'
import {
	CreateSplitAsesorParams,
	CreateSplitDerive,
	CreateSplitParams,
	CreateSplitSchedule,
	DeleteSplitAsesorParams,
	DeleteSplitDerive,
	DeleteSplitParams,
	Derivacion,
	HorarioSplit,
	HorariosAtencion,
	SplitAsesorParams,
	Splits,
	SplitsAsesor,
	UpdateSplitParams,
} from '@/types/Splits'

// Obtener splits
export async function getSplits(idOrg: number) {
	const response = await humanlAgentWithAuthClient.get<Splits[]>(
		`/api/obtenerSplits?idOrg=${idOrg}`
	)

	return response.data
}

// Crear split
export async function createSplit(params: Partial<CreateSplitParams>) {
	const response = await humanlAgentWithAuthClient.post<Splits>(
		'/api/crearSplit',
		params
	)

	return response.data
}

// Actualizar split
export async function updateSplit(params: Partial<UpdateSplitParams>) {
	const response = await humanlAgentWithAuthClient.post<Splits>(
		'/api/actualizarSplit',
		params
	)

	return response.data
}

// Eliminar split
export async function deleteSplit(params: DeleteSplitParams) {
	const response = await humanlAgentWithAuthClient.delete<boolean>(
		'/api/borrarSplit',
		{ params }
	)

	return response.data
}

// Splits del asesor humano
export async function getAgentSplits(params: SplitAsesorParams) {
	const response = await humanlAgentWithAuthClient.get<SplitsAsesor[]>(
		'/api/obtenerSplitUsuarios',
		{ params }
	)

	return response.data
}

// Crear split al asesor humano
export async function createAgentSplit(params: CreateSplitAsesorParams) {
	const response = await humanlAgentWithAuthClient.post<SplitsAsesor>(
		'/api/crearSplitUsuario',
		params
	)

	return response.data
}

// Borrar split del asesor humano
export async function deleteAgentSplit(params: DeleteSplitAsesorParams) {
	const response = await humanlAgentWithAuthClient.delete<boolean>(
		'/api/borrarSplitUsuario',
		{ params }
	)

	return response.data
}

// Crear horario split
export async function createSplitSchedule(params: CreateSplitSchedule) {
	const response = await humanlAgentWithAuthClient.post<HorarioSplit>(
		'/api/crearHorarioSplit',
		params
	)

	return response.data
}

// Actualizar horario split
export async function updateSplitSchedule(params: HorariosAtencion[]) {
	const response = await humanlAgentWithAuthClient.post<string>(
		'/api/actualizarHorarioSplit',
		params
	)

	return response.data
}

// Eliminar horario split
export async function deleteSplitSchedule(codigoRegistro: number) {
	const response = await humanlAgentWithAuthClient.delete<string>(
		'/api/borrarHorarioSplit',
		{
			params: {
				codigoRegistro,
			},
		}
	)

	return response.data
}

// Crear derivación split
export async function createSplitDerive(params: CreateSplitDerive) {
	const response = await humanlAgentWithAuthClient.post<Derivacion>(
		'/api/crearSplitDerive',
		params
	)

	return response.data
}

// Actualización derivación split
export async function updateSplitDerive(params: Derivacion[]) {
	const response = await humanlAgentWithAuthClient.post<string>(
		'/api/actualizarSplitDerive',
		params
	)

	return response.data
}

// Eliminar derivación split
export async function deleteSplitDerive(params: DeleteSplitDerive) {
	const response = await humanlAgentWithAuthClient.delete<string>(
		'/api/borrarSplitDerive',
		{ params }
	)

	return response.data
}
