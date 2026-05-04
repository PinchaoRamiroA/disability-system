import { EmailsConfig } from '@/types/Notificaciones'

import { ALFA_ACENTO_ESPACIO, EMAIL } from '@/utils/constants/regex'

export const validate = () => (values: Partial<EmailsConfig>) => {
	const errors: Partial<{
		email: string
		namePerson: string
	}> = {}

	values.email = values.email?.trim()
	values.namePerson = values.namePerson?.trim()

	if (!values.email) {
		errors.email = 'Campo obligatorio'
	} else if (values.email.length > 100) {
		errors.email = 'El campo no debe ser mayor a 100 carácteres'
	} else if (!EMAIL.test(values.email)) {
		errors.email = 'El campo no tiene un formato válido de email'
	}

	if (!values.namePerson) {
		errors.namePerson = 'Campo obligatorio'
	} else if (values.namePerson.length > 200) {
		errors.namePerson = 'El campo no debe ser mayor a 200 carácteres'
	} else if (!ALFA_ACENTO_ESPACIO.test(values.namePerson)) {
		errors.namePerson =
			'El campo no permite números ni carácteres especiales'
	}

	return errors
}
