import React, { useEffect } from 'react'
import { AlertDialog } from '@/components/Dialog'
import { FormDialog } from '@/components/Dialog/styles'
import { EmailsConfig } from '@/types/Notificaciones'
import { TextField } from '@mui/material'
import { useFormik } from 'formik'
import { validate } from './validate'

interface Props {
	open: boolean
	config: Partial<EmailsConfig>
	cancelAction: () => void
	confirmAction: (emailConfig: Partial<EmailsConfig>) => void
	createForm?: boolean
}

const initialValues: Partial<EmailsConfig> = { email: '', namePerson: '' }

export const UpsertModal = ({
	open,
	config,
	cancelAction,
	confirmAction,
	createForm,
}: Props) => {
	const formik = useFormik({
		initialValues: createForm ? initialValues : config,
		validate: validate(),
		onSubmit: (values) => {
			confirmAction(values)
		},
		validateOnChange: false,
		validateOnBlur: false,
	})

	// Resetear formulario cada vez que se abre el formulario
	useEffect(() => {
		if (!open) {
			formik.resetForm()
		}
	}, [open])

	return (
		<AlertDialog
			open={open}
			title={createForm ? 'Crear Email' : 'Actualizar Email'}
			confirmButtonText={createForm ? 'Crear' : 'Actualizar'}
			formikFormId="email-form"
			onClose={cancelAction}
		>
			<FormDialog onSubmit={formik.handleSubmit} id="email-form">
				{/* Email */}
				<TextField
					id="email"
					name="email"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.email}
					error={Boolean(formik.errors.email)}
					label="Email"
					placeholder="Email"
					variant="outlined"
					helperText={formik.errors.email}
					InputProps={{
						inputProps: {
							maxLength: 100,
						},
					}}
				/>
				{/* Nombre persona */}
				<TextField
					id="namePerson"
					name="namePerson"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.namePerson}
					helperText={formik.errors.namePerson}
					error={Boolean(formik.errors.namePerson)}
					label="Nombre persona"
					placeholder="Nombre persona"
					variant="outlined"
					maxRows={4}
					InputProps={{
						inputProps: {
							maxLength: 200,
						},
					}}
				/>
			</FormDialog>
		</AlertDialog>
	)
}
