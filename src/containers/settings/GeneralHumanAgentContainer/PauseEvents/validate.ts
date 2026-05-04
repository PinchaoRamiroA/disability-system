import { PauseEvent } from '@/types/PauseEvents'
import { ALFANUM_CHARS_PUNTO_GUION_ESPACIO } from '@/utils/constants/regex'

export const validate = () => (values: Partial<PauseEvent>) => {
	const errors: Partial<{
		name: string
		description: string
	}> = {}

	values.name = values.name?.trim()
	values.description = values.description?.trim()

	// Nombre
	if (!values.name) {
		errors.name = 'Campo obligatorio'
	} else if (values.name.length > 30) {
		errors.name = 'El campo no debe ser mayor a 30 carácteres'
	} else if (!ALFANUM_CHARS_PUNTO_GUION_ESPACIO.test(values.name)) {
		errors.name =
			'El campo no permite carácteres especiales diferentes a _-.'
	}

	// Descripción
	if (!values.description) {
		errors.description = 'Campo obligatorio'
	} else if (values.description.length > 100) {
		errors.description = 'El campo no debe ser mayor a 100 carácteres'
	} else if (!ALFANUM_CHARS_PUNTO_GUION_ESPACIO.test(values.description)) {
		errors.description =
			'El campo no permite carácteres especiales diferentes a _-.'
	}

	return errors
}
