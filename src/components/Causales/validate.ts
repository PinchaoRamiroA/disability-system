import { Causal } from '@/types/Causales'
import { ALFANUM_CHARS_PUNTO_GUION_ESPACIO } from '@/utils/constants/regex'

export const validate = () => (values: Partial<Causal>) => {
	const errors: Partial<{
		nombre: string
		descripcion: string
	}> = {}

	values.nombre = values.nombre?.trim()
	values.descripcion = values.descripcion?.trim()

	// Nombre
	if (!values.nombre) {
		errors.nombre = 'Campo obligatorio'
	} else if (values.nombre.length > 100) {
		errors.nombre = 'El campo no debe ser mayor a 100 carácteres'
	} else if (!ALFANUM_CHARS_PUNTO_GUION_ESPACIO.test(values.nombre)) {
		errors.nombre =
			'El campo no permite carácteres especiales diferentes a _-.'
	}

	// Descripción
	if (!values.descripcion) {
		errors.descripcion = 'Campo obligatorio'
	} else if (values.descripcion.length > 200) {
		errors.descripcion = 'El campo no debe ser mayor a 200 carácteres'
	} else if (!ALFANUM_CHARS_PUNTO_GUION_ESPACIO.test(values.descripcion)) {
		errors.descripcion =
			'El campo no permite carácteres especiales diferentes a _-.'
	}

	return errors
}
