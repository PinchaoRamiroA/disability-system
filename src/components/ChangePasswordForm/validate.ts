import { PASSWORD_STRONG } from '@/utils/constants/regex'

export const validate = (values: {
	currentPassword: string
	newPassword: string
	confirmationPassword: string
}) => {
	const errors: Partial<{
		currentPassword: string
		newPassword: string
		confirmationPassword: string
	}> = {}

	if (!values.currentPassword) {
		errors.currentPassword = 'La contraseña original es requerida'
	}
	// else if (values.currentPassword.length < 12) {
	// 	errors.currentPassword =
	// 		'La contraseña debe tener al menos 12 caracteres'
	// }
	else if (values.currentPassword.length > 50) {
		errors.currentPassword =
			'La contraseña no puede tener más de 50 caracteres'
	}

	if (!values.newPassword) {
		errors.newPassword = 'Ingresa la nueva contraseña'
	} else if (values.newPassword.length < 12) {
		errors.newPassword = 'La contraseña debe tener al menos 12 caracteres'
	} else if (values.newPassword.length > 20) {
		errors.newPassword = 'La contraseña no puede tener más de 20 caracteres'
	} else if (
		values.currentPassword &&
		values.currentPassword === values.newPassword
	) {
		errors.newPassword =
			'Ingresa una contraseña diferente a la ingresada en el campo anterior'
	} else if (!PASSWORD_STRONG.test(values.newPassword)) {
		errors.newPassword =
			'La contraseña debe tener mínimo una letra mayúscula, una minúscula, un número y al menos uno de estos caracteres !@#$%^&*._-()'
	}

	if (!values.confirmationPassword) {
		errors.confirmationPassword = 'Este campo es requerido'
	} else if (values.confirmationPassword.length < 12) {
		errors.confirmationPassword =
			'La contraseña debe tener al menos 12 caracteres'
	} else if (values.confirmationPassword.length > 50) {
		errors.confirmationPassword =
			'La contraseña no puede tener más de 50 caracteres'
	} else if (
		values.newPassword &&
		values.newPassword !== values.confirmationPassword
	) {
		errors.confirmationPassword = 'Las contraseñas no coinciden'
	}

	return errors
}
