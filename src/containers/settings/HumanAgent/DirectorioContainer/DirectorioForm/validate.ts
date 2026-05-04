import { Contact } from '@/types/Settings/asesor-humano/directorio'

export const validate =
	(availablePhones: string[]) => (values: Partial<Contact>) => {
		const errors: Partial<{
			name: string
			email: string
			phone: string
			idType: string
			idNumber: string
			idDepartment: string
			idCity: string
		}> = {}

		values.name = values.name?.trim()
		values.email = values.email?.trim()
		values.phone = values.phone?.trim()
		values.idNumber = values.idNumber?.trim()

		// Nombre
		if (!values.name) {
			errors.name = 'Requerido'
		} else if (values.name.length > 50) {
			errors.name = 'Campo no debe ser mayor a 50 carácteres'
		} else if (!/^[a-záéíóúüñ-\s]*$/i.test(values.name)) {
			errors.name = 'Campo solo permite letras'
		}

		// Teléfono
		if (!values.phone) {
			errors.phone = 'Requerido'
		} else if (!/^\d*$/.test(values.phone)) {
			errors.phone = 'Solo se permiten números'
		} else if (values.phone.length !== 10) {
			errors.phone = 'El número debe tener 10 dígitos'
		} else if (availablePhones.includes(values.phone)) {
			errors.phone = 'Ya existe un contacto registrado con este número'
		}
		// else if (!/^\d{10}$/.test(values.phone)) {
		// 	errors.phone = 'Debe ser un número entre 10 y 20 dígitos'
		// }

		// Email
		if (values.email) {
			if (values.email.length > 50) {
				errors.email = 'Campo no debe ser mayor a 50 caracteres'
			} else if (
				!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
					values.email
				)
			) {
				errors.email = 'Formato de correo inválido'
			}
		}

		// Tipo de Identificación (requerido si se ingresa número de documento)
		if (values.idNumber && !values.idType) {
			errors.idType = 'Requerido'
		}

		// Número de Identificación
		if (values.idNumber) {
			// Cuando el tipo de documento es pasaporte, se pueden ingresar letras
			if (values.idType === 'PASAPORTE') {
				if (!/^[A-Z\d]*$/i.test(values.idNumber)) {
					errors.idNumber = 'Solo se permiten letras y números'
				}
			} else if (!/^\d*$/.test(values.idNumber)) {
				errors.idNumber = 'Solo se permiten números'
			}

			if (values.idNumber.length > 30) {
				errors.idNumber = 'Campo no debe ser mayor a 30 caracteres'
			}
		}
		// Requerido si se selecciona el tipo de documento
		else if (values.idType) {
			errors.idNumber = 'Requerido'
		}

		// Id Departamento
		// if (!values.idDepartment) {
		// 	errors.idDepartment = 'Requerido'
		// }

		// Id Ciudad (requerido si se selecciona departamento)
		if (values.idDepartment && !values.idCity) {
			errors.idCity = 'Requerido'
		}

		return errors
	}
