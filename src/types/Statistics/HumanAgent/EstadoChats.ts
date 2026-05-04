export type EstadoChatsEnum =
	| 'En Cola'
	| 'Asignado'
	| 'Error - Asesor Desconectado'

export interface EstadoChats {
	[key: string]: string | number
	id: number
	idConv: string
	tipoIdCliente: string
	idCliente: string
	nombreCliente: string
	nombreSplit: string
	estado: EstadoChatsEnum
	nombreAsesorAsignado: string
	fechaEntrada: string
}
