import React, { useEffect } from 'react'
import { PauseEvent } from '@/types/PauseEvents'
import { useFormik } from 'formik'
import { AlertDialog } from '@/components/Dialog'
import { FormDialog } from '@/components/Dialog/styles'
import { TextField } from '@mui/material'
import { validate } from './validate'

interface Props {
	open: boolean
	event: Partial<PauseEvent>
	confirmAction: (event: Partial<PauseEvent>) => void
	cancelAction: (event?: Partial<PauseEvent>) => void
	isCreateForm?: boolean
}

export const EventsForm = ({
	cancelAction,
	confirmAction,
	open,
	event,
	isCreateForm = false,
}: Props) => {
	const formik = useFormik({
		validateOnChange: false,
		validateOnBlur: false,
		initialValues: isCreateForm
			? {
					description: '',
					name: '',
			  }
			: event,
		validate: validate(),
		onSubmit: (values) => {
			confirmAction(values)
		},
	})

	// Limpiar formulario cuando se cierra el popup
	useEffect(() => {
		if (!open) {
			formik.resetForm()
		}
	}, [open])

	return (
		<AlertDialog
			open={open}
			title={
				isCreateForm
					? 'Crear evento de pausa'
					: 'Actualizar evento de pausa'
			}
			formikFormId="pause-event-form"
			onClose={cancelAction}
		>
			<FormDialog id="pause-event-form" onSubmit={formik.handleSubmit}>
				{/* Nombre del Evento */}
				<TextField
					id="name"
					name="name"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.name}
					error={Boolean(formik.errors.name)}
					label="Nombre del Evento"
					placeholder="Nombre del Evento"
					variant="outlined"
					helperText={formik.errors.name}
					InputProps={{
						inputProps: {
							maxLength: 30,
						},
					}}
				/>
				{/* Descripción del Evento */}
				<TextField
					id="description"
					name="description"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.description}
					helperText={formik.errors.description}
					error={Boolean(formik.errors.description)}
					label="Descripción del Evento"
					placeholder="Descripción del Evento"
					variant="outlined"
					multiline
					maxRows={4}
					InputProps={{
						inputProps: {
							maxLength: 100,
						},
					}}
				/>
			</FormDialog>
		</AlertDialog>
	)
}
