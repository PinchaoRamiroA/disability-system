import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import { Company } from '@/types/Company'

export async function getCompanies() {
	const response = await orchestratorWithAuthClient.get<Company[]>(
		'/api/organizations'
	)
	return response.data
}

export async function getActiveCompanies() {
	const response = await orchestratorWithAuthClient.get<Company[]>(
		'/api/organizations/actives'
	)
	return response.data
}

//TODO: Validar respuesta de server
export async function createCompany(company: Partial<Company>) {
	const response = await orchestratorWithAuthClient.post(
		'/api/organizations',
		company
	)

	return response.data
}

//TODO: Validar respuesta de server
export async function putCompany(company: Partial<Company>) {
	const response = await orchestratorWithAuthClient.put(
		'/api/organizations',
		company
	)

	return response.data
}

//TODO: Validar respuesta de server
export async function deleteCompany(id: number) {
	const response = await orchestratorWithAuthClient.delete(
		`/api/organizations/${id}`
	)

	return response.data
}
