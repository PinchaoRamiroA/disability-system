import { humanlAgentWithAuthClient } from '@/services/api/utilities/instances'
import {
	CreatePauseEvent,
	DeletePauseEvent,
	PauseEvent,
} from '@/types/PauseEvents'

// Obtener eventos de pausa
export const getPauseEvents = async () => {
	const response = await humanlAgentWithAuthClient.get<PauseEvent[]>(
		'/api/obtenerEventosPausa?alsoDeleted=false'
	)

	return response.data
}

// Crear evento de pausa
export async function createPauseEvent(params: Partial<CreatePauseEvent>) {
	const response = await humanlAgentWithAuthClient.post<PauseEvent>(
		'/api/crearEventoPausa',
		params
	)

	return response.data
}

// Actualizar evento de pausa
export async function updatePauseEvent(params: Partial<PauseEvent>) {
	const response = await humanlAgentWithAuthClient.post<PauseEvent>(
		'/api/actualizarEventoPausa',
		params
	)

	return response.data
}

// Eliminar evento de pausa
export async function deletePauseEvent(params: DeletePauseEvent) {
	const response = await humanlAgentWithAuthClient.delete<number>(
		'/api/eliminarEventoPausa',
		{ params }
	)

	return response.data
}
