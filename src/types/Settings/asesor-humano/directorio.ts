import { DocumentTypeTypes } from '@/types/DocumentTypes'
import { Adjunto, TipoMensaje, TipoUsuario } from '@/types/HumanAgent/WebChat'

export interface AbstractContact {
	email: string
	idContact: number
	idNumber: string
	idOrg: number
	idType: DocumentTypeTypes
	idVa: number
	isActive: boolean
	name: string
	phone: string
}

export interface RawContact extends AbstractContact {
	city: Location
	department: Location
}

export interface Contact extends AbstractContact {
	[key: string]: number | string | boolean | Location | undefined
	id: number | string
	idDepartment: number
	idCity: number
	department: string
	city: string
	split?: string
}

export interface MensajeDirectorio {
	adjunto: Adjunto | null
	mensaje: string
	tipoUsuario: TipoUsuario
	tipoMensaje: TipoMensaje
	fechaMensaje: string
}

export interface ContactBAHPayload {
	idCiudad: number
	ciudad: string
	departamento: string
	email: string
	identificacion: string
	tipoIdentificacion: DocumentTypeTypes
	nombre: string
	telefono: string
	idVa: number
	listadoMensajes: MensajeDirectorio[]
}

export interface ContactBAH extends ContactBAHPayload {
	active?: boolean
	split?: string
}

export interface Location {
	[key: string]: number | string
	id: number
	name: string
}

// Parámetros para crear un contacto
export interface CreateContact {
	body: CreateContactBody
	handleCloseCreate: () => void
	resetSubmitting?: () => void
}
export interface CreateContactBody {
	idOrg?: number
	payload: {
		idVa: number
		name: string
		phone: string
		idType?: string
		idNumber?: string
		idCity?: number
		email?: string
	}
}

// Parámetros para actualizar un contacto
export interface UpdateContact {
	body: UpdateContactBody
	handleCloseUpdate?: () => void
	resetSubmitting?: () => void
}
interface OverrideContact {
	id: number | string
	name: string
	phone: string
	email: string
	idType: DocumentTypeTypes | ''
	idNumber: string
	idCity: number | null
	isActive: boolean
}

export interface UpdateContactBody {
	idOrg?: number
	payload: Partial<OverrideContact>
}

// Parámetros para borrar un contacto
export interface DeleteContact {
	idOrg?: number
	idContact: number
}
