import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import {
	CreateRegionalParams,
	DeleteRegionalParams,
	Department,
	Locations,
	Region,
	UpdateDepartmentParams,
	UpdateRegionalParams,
} from '@/types/Locations'

export async function getLocations(idOrg: number, requireCities = false) {
	const response = await orchestratorWithAuthClient.get<Locations>(
		'/api/location/locationList/',
		{ params: { idOrg, requireCities } }
	)

	return response.data
}

// Crear regional
export async function createRegional(params: CreateRegionalParams) {
	const { idOrg, name } = params
	const response = await orchestratorWithAuthClient.post<Region>(
		`/api/location/createRegional?idOrg=${idOrg}`,
		{ name }
	)

	return response.data
}

// Actualizar regional
export async function updateRegional(params: UpdateRegionalParams) {
	const { idOrg, ...rest } = params
	const response = await orchestratorWithAuthClient.post<Region>(
		`/api/location/updateRegional?idOrg=${idOrg}`,
		rest
	)

	return response.data
}

// Eliminar regional
export async function deleteRegional(params: DeleteRegionalParams) {
	const response = await orchestratorWithAuthClient.delete<boolean>(
		'/api/location/deleteRegional',
		{ params }
	)

	return response.data
}

// Actualizar departamento
export async function updateDepartment(params: UpdateDepartmentParams) {
	const { id, idOrg, idRegional } = params

	const searchParams = new URLSearchParams()

	searchParams.append('id', id.toString())
	searchParams.append('idOrg', idOrg.toString())
	searchParams.append('idRegional', idRegional.toString())

	const response = await orchestratorWithAuthClient.post<Department>(
		`/api/location/updateDepartment?${searchParams.toString()}`
	)

	return response.data
}
