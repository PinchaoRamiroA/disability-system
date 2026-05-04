import { NormalizedUser } from '@/types/users'
import {
	ALFA_ACENTO_ESPACIO,
	ALFANUM_PUNTO_GUION_NO_ESPACIO,
	PASSWORD_STRONG,
} from '@/utils/constants/regex'

export const validate = (
	values: Partial<NormalizedUser>,
	isCreateForm?: boolean
) => {
	const errors: Partial<{
		fullName: string
		email: string
		role: string
		company: string
		password?: string
	}> = {}

	values.fullName = values.fullName?.trim()
	values.email = values.email?.trim()
	values.password = values.password?.trim()

	if (!values.fullName) {
		errors.fullName = 'Campo obligatorio'
	} else if (values.fullName.length > 200) {
		errors.fullName = 'El campo no debe ser mayor a 200 carácteres'
	} else if (!ALFA_ACENTO_ESPACIO.test(values.fullName)) {
		errors.fullName = 'El campo no permite números ni carácteres especiales'
	}
	if (!values.email) {
		errors.email = 'Campo obligatorio'
	} else if (values.email.length > 100) {
		errors.email = 'El campo no debe ser mayor a 100 carácteres'
	} else if (!ALFANUM_PUNTO_GUION_NO_ESPACIO.test(values.email)) {
		errors.email =
			'El campo no permite espacios, acentos ni caracteres diferentes a _-.'
	}

	if (isCreateForm) {
		if (!values.password) {
			errors.password = 'Campo obligatorio'
		}
	}
	if (values.password) {
		if (values.password.length < 12) {
			errors.password = 'La contraseña debe tener al menos 12 caracteres'
		} else if (values.password.length > 20) {
			errors.password =
				'La contraseña no puede tener más de 20 caracteres'
		} else if (!PASSWORD_STRONG.test(values.password)) {
			errors.password =
				'La contraseña debe tener al menos una letra mayúscula, una minúscula, un número y almenos uno de estos caracteres !@#$%^&*._-()'
		}
	}

	if (!values.company || values.company === 0) {
		errors.company = 'Organización requerida'
	}

	if (!values.role || values.role === 0) {
		errors.role = 'El rol es obligatorio'
	}

	return errors
}
