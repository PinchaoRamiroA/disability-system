import {
	humanAgentClient,
	humanlAgentWithAuthClient,
} from '@/services/api/utilities/instances'
import { MensajesConfig } from '@/types/Settings/Mensajes'

// Obtener mensajes de configuración
export const getMensajesConfig = async () => {
	const response = await humanlAgentWithAuthClient.get<MensajesConfig[]>(
		'/api/mensajesFinConv/obtenerMensajesFinConvCliente'
	)
	return response.data
}

// Actualizar mensaje de configuración
export async function updateMensajeConfig(params: MensajesConfig) {
	const response = await humanlAgentWithAuthClient.post<MensajesConfig>(
		'/api/mensajesFinConv/actualizarMensajeFinConversacion',
		params
	)

	return response.data
}

// Obtener mensajes de configuración
export const getFullConfigMensajes = async () => {
	const response = await humanAgentClient.get<MensajesConfig[]>(
		'/api/mensajesFinConv/obtenerMensajesFinConversacion'
	)
	return response.data
}
