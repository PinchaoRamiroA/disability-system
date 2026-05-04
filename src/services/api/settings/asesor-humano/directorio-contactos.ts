import { humanlAgentWithAuthClient } from '@/services/api/utilities/instances'
import { IdVaAndOrOrg } from '@/types/OrgAndIdva'
import {
	CreateContactBody,
	DeleteContact,
	RawContact,
	UpdateContactBody,
} from '@/types/Settings/asesor-humano/directorio'

// Obtener todos contactos del directorio
export const getContactsApi = async ({ idVa, idOrg }: IdVaAndOrOrg) => {
	const response = await humanlAgentWithAuthClient.get<RawContact[]>(
		'/api/directory/contacts',
		{ params: { idVa, ...(idOrg && { idOrg }) } }
	)
	return response.data
}

// Obtener contactos activos del directorio
export const getActiveContactsApi = async (idVa?: number) => {
	const response = await humanlAgentWithAuthClient.get<RawContact[]>(
		'/api/directory/contacts/actives',
		idVa ? { params: { idVa } } : undefined
	)
	return response.data
}

// Crear nuevo contacto del directorio
export const createContactApi = async ({
	payload,
	idOrg,
}: CreateContactBody) => {
	const response = await humanlAgentWithAuthClient.post<RawContact>(
		`/api/directory/contacts${idOrg ? `idOrg=${idOrg}` : ''}`,
		payload
	)
	return response.data
}

// Actualizar plantilla de respuesta
export const updateContactApi = async ({
	payload,
	idOrg,
}: UpdateContactBody) => {
	const response = await humanlAgentWithAuthClient.put<RawContact>(
		`/api/directory/contacts${idOrg ? `idOrg=${idOrg}` : ''}`,
		payload
	)

	return response.data
}

// Borrar plantilla de respuesta
export const deleteContactApi = async ({ idContact, idOrg }: DeleteContact) => {
	const response = await humanlAgentWithAuthClient.delete<boolean>(
		`/api/directory/contacts/${idContact}${idOrg ? `idOrg=${idOrg}` : ''}`
	)

	return response.data
}
