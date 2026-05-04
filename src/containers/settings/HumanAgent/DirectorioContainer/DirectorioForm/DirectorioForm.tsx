import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { validate } from './validate'
import { AlertDialog } from '@/components/Dialog'
import { FormDialog } from '@/components/Dialog/styles'
import { Autocomplete, TextField } from '@mui/material'
import { Contact } from '@/types/Settings/asesor-humano/directorio'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { locationsSelector } from '@/store/slices/locations'
import { City, Department } from '@/types/Locations'
import { DOCUMENT_TYPES } from '@/utils/constants/documentTypes'
import { DocumentType } from '@/types/DocumentTypes'

interface Props {
	open: boolean
	contact: Partial<Contact>
	phones: string[]
	confirmAction: (
		company: Partial<Contact>,
		resetSubmitting: () => void
	) => void
	cancelAction: (company?: Partial<Contact>) => void
	confirmText?: string
	cancelText?: string
	isCreateForm?: boolean
}

export const DirectorioForm = ({
	cancelAction,
	confirmAction,
	open,
	contact,
	phones,
	cancelText = 'Cancelar',
	confirmText = 'Confirmar',
	isCreateForm = false,
}: Props) => {
	const formik = useFormik<Partial<Contact>>({
		validateOnChange: false,
		validateOnBlur: false,
		initialValues: isCreateForm
			? {
					email: '',
					idCity: undefined,
					idDepartment: undefined,
					idNumber: '',
					idType: undefined,
					name: '',
					phone: '',
			  }
			: contact,
		validate: validate(phones),
		onSubmit: (values) => {
			confirmAction(values, () => {
				formik.setSubmitting(false)
			})
		},
	})

	const { resource: locations } = useAppSelector(locationsSelector)

	// Selección de Tipo de document en autocomplete
	const [documentTypeSelected, setDocumentTypeSelected] =
		useState<DocumentType | null>(null)
	// Selección de Departamento y Ciudad en autocomplete
	const [departmentSelected, setDepartmentSelected] =
		useState<Department | null>(null)
	const [cities, setCities] = useState<City[]>([])
	const [citySelected, setCitySelected] = useState<City | null>(null)

	// Manejador de evento de autocomplete para tipo de document
	const handleChangeDocumentType = (
		_: React.SyntheticEvent,
		value: DocumentType | null
	) => {
		formik.setFieldValue('idType', value?.id)
		setDocumentTypeSelected(value)
	}

	// Manejador de evento de autocomplete para Departamento
	const handleChangeDepartment = (
		_: React.SyntheticEvent,
		value: Department | null
	) => {
		handleChangeCity(_, null)
		formik.setFieldValue('idDepartment', value?.id)
		setDepartmentSelected(value)
	}

	// Manejador de evento de autocomplete para Departamento
	const handleChangeCity = (_: React.SyntheticEvent, value: City | null) => {
		formik.setFieldValue('idCity', value?.id)
		setCitySelected(value)
	}

	// Resetear formulario al cerrar modal
	useEffect(() => {
		if (!open) {
			setDocumentTypeSelected(null)
			setDepartmentSelected(null)
			setCitySelected(null)
			formik.resetForm()
		}
	}, [open])

	// Buscar tipo de documento, departamento y ciudad para setear autocomplete en modo de actualización
	useEffect(() => {
		const { idType, idCity, idDepartment } = contact
		// Setear tipo de documento
		if (idType) {
			const found = DOCUMENT_TYPES.find((item) => item.id === idType)
			setDocumentTypeSelected(found ?? null)
		}

		// Setear ciudad
		if (idCity) {
			const found = locations.cities.find((item) => item.id === idCity)
			setCitySelected(found ?? null)
		}

		// Setear departamento
		if (idCity) {
			const found = locations.departments.find(
				(item) => item.id === idDepartment
			)
			setDepartmentSelected(found ?? null)
		}
	}, [contact])

	// Cargar ciudades según departamento
	useEffect(() => {
		setCities(
			locations.cities.filter(
				(city) => city.idDepartment === departmentSelected?.id
			)
		)
	}, [departmentSelected])

	return (
		<AlertDialog
			open={open}
			title={isCreateForm ? 'Crear contacto' : 'Actualizar contacto'}
			closeButtonText={cancelText}
			confirmButtonText={confirmText}
			formikFormId="contact-form"
			onClose={cancelAction}
			submitting={formik.isSubmitting}
		>
			<FormDialog onSubmit={formik.handleSubmit} id="contact-form">
				{/* Nombre del contacto */}
				<TextField
					id="name"
					name="name"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.name}
					error={Boolean(formik.errors.name)}
					label="Nombre"
					placeholder="Nombre del contacto"
					variant="outlined"
					helperText={formik.errors.name}
					inputProps={{ maxLength: 50 }}
				/>
				{/* Teléfono */}
				<TextField
					id="phone"
					name="phone"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.phone}
					error={Boolean(formik.errors.phone)}
					label="Teléfono"
					placeholder="Número de Teléfono"
					variant="outlined"
					helperText={formik.errors.phone}
					inputProps={{ maxLength: 20 }}
				/>
				{/* Correo Electrónico */}
				<TextField
					id="email"
					name="email"
					type="email"
					onChange={formik.handleChange}
					value={formik.values.email}
					error={Boolean(formik.errors.email)}
					label="Correo Electrónico"
					placeholder="Correo Electrónico"
					variant="outlined"
					helperText={formik.errors.email}
					inputProps={{ maxLength: 50 }}
				/>
				{/* Tipo de Identificación */}
				<Autocomplete
					options={DOCUMENT_TYPES}
					fullWidth
					value={documentTypeSelected}
					getOptionLabel={(option) => option.name ?? ''}
					onChange={handleChangeDocumentType}
					renderOption={(props, option) => (
						<li {...props} key={option.id}>
							{option.name}
						</li>
					)}
					renderInput={(params) => (
						<TextField
							{...params}
							name="departaments"
							label="Selecciona un tipo de documento"
							value={formik.values.idType}
							error={Boolean(formik.errors.idType)}
							helperText={formik.errors.idType}
						/>
					)}
				/>
				{/* Número de Identificación */}
				<TextField
					id="idNumber"
					name="idNumber"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.idNumber}
					error={Boolean(formik.errors.idNumber)}
					label="Número de Identificación"
					placeholder="Número de Identificación"
					variant="outlined"
					helperText={formik.errors.idNumber}
					inputProps={{ maxLength: 30 }}
				/>
				{/* Departamento */}
				<Autocomplete
					options={locations.departments}
					fullWidth
					value={departmentSelected}
					getOptionLabel={(option) => option.name ?? ''}
					onChange={handleChangeDepartment}
					renderOption={(props, option) => (
						<li {...props} key={option.id}>
							{option.name}
						</li>
					)}
					renderInput={(params) => (
						<TextField
							{...params}
							name="departaments"
							label="Selecciona un departamento"
							value={formik.values.idDepartment}
							error={Boolean(formik.errors.idDepartment)}
							helperText={formik.errors.idDepartment}
						/>
					)}
				/>
				{/* Ciudad */}
				<Autocomplete
					options={cities}
					fullWidth
					value={citySelected}
					getOptionLabel={(option) => option.name ?? ''}
					onChange={handleChangeCity}
					renderOption={(props, option) => (
						<li {...props} key={option.id}>
							{option.name}
						</li>
					)}
					renderInput={(params) => (
						<TextField
							{...params}
							name="city"
							label="Selecciona una ciudad"
							value={formik.values.idCity}
							error={Boolean(formik.errors.idCity)}
							helperText={formik.errors.idCity}
						/>
					)}
				/>
			</FormDialog>
		</AlertDialog>
	)
}
