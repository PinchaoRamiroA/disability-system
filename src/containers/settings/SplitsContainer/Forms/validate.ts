import { Splits } from '@/types/Splits'
import { ALFANUM_CHARS_PUNTO_GUION_ESPACIO } from '@/utils/constants/regex'

export const validate = () => (values: Partial<Splits>) => {
	const errors: Partial<{
		nombre: string
		descripcion: string
		timeInactivityAgent: string
		timeInactivityClient: string
		timeMaxInitConversation: string
	}> = {}

	values.nombre = values.nombre?.trim()
	values.descripcion = values.descripcion?.trim()

	// Nombre
	if (!values.nombre) {
		errors.nombre = 'Campo obligatorio'
	} else if (values.nombre.length > 30) {
		errors.nombre = 'El campo no debe tener más de 30 carácteres'
	} else if (!ALFANUM_CHARS_PUNTO_GUION_ESPACIO.test(values.nombre)) {
		errors.nombre =
			'El campo no permite carácteres especiales diferentes a _-.'
	}

	// Descripción
	if (!values.descripcion) {
		errors.descripcion = 'Campo obligatorio'
	} else if (values.descripcion.length > 100) {
		errors.descripcion = 'El campo no debe tener más de 100 carácteres'
	} else if (!ALFANUM_CHARS_PUNTO_GUION_ESPACIO.test(values.descripcion)) {
		errors.descripcion =
			'El campo no permite carácteres especiales diferentes a _-.'
	}

	// Tiempos de inactividad asesor
	if (!values.timeInactivityAgent || values.timeInactivityAgent <= 0) {
		errors.timeInactivityAgent = 'Campo obligatorio'
	} else if (values.timeInactivityAgent.toString().length > 11) {
		errors.timeInactivityAgent =
			'El campo no debe tener más de 11 caracteres'
	}

	// Tiempos de inactividad cliente
	if (!values.timeInactivityClient || values.timeInactivityClient <= 0) {
		errors.timeInactivityClient = 'Campo obligatorio'
	} else if (values.timeInactivityClient.toString().length > 11) {
		errors.timeInactivityClient =
			'El campo no debe tener más de 11 caracteres'
	}

	// Tiempos de inicio de conversación
	if (
		!values.timeMaxInitConversation ||
		values.timeMaxInitConversation <= 0
	) {
		errors.timeMaxInitConversation = 'Campo obligatorio'
	} else if (values.timeMaxInitConversation.toString().length > 11) {
		errors.timeMaxInitConversation =
			'El campo no debe tener más de 11 caracteres'
	}

	return errors
}
