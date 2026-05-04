import { NormalizedPlantillaRespuesta } from '@/types/Settings/asesor-humano/plantillas-respuesta'
import {
	ALFANUM_CHARS_ESPACIO,
	ALFANUM_CHARS_PUNTO_GUION_ESPACIO,
} from '@/utils/constants/regex'

export const validate = () => (values: NormalizedPlantillaRespuesta) => {
	const errors: Partial<{
		templateName: string
		templateContent: string
	}> = {}

	values.templateName = values.templateName?.trim()
	values.templateContent = values.templateContent?.trim()

	if (!values.templateName) {
		errors.templateName = 'Campo obligatorio'
	} else if (values.templateName.length > 100) {
		errors.templateName = 'Campo no debe ser mayor a 100 carácteres'
	} else if (!ALFANUM_CHARS_PUNTO_GUION_ESPACIO.test(values.templateName)) {
		errors.templateName =
			'El campo no permite caracteres especiales diferentes a _-.'
	}

	if (!values.templateContent) {
		errors.templateContent = 'Campo obligatorio'
	} else if (values.templateContent.length > 600) {
		errors.templateContent = 'Campo no debe ser mayor a 600 carácteres'
	} else if (!ALFANUM_CHARS_ESPACIO.test(values.templateContent)) {
		errors.templateContent =
			'Puedes utilizar algunos caracteres especiales como ().,:;+-_¿?'
	}

	return errors
}
