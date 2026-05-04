import React, { useEffect } from 'react'
import { Splits } from '@/types/Splits'
import { useFormik } from 'formik'
import { validate } from './validate'
import { AlertDialog } from '@/components/Dialog'
import { FormDialog } from '@/components/Dialog/styles'
import { TextField } from '@mui/material'

interface Props {
	open: boolean
	split: Partial<Splits>
	confirmAction: (company: Partial<Splits>) => void
	cancelAction: (company?: Partial<Splits>) => void
	confirmText?: string
	cancelText?: string
	isCreateForm?: boolean
}

export const SplitsForm = ({
	cancelAction,
	confirmAction,
	open,
	split,
	cancelText = 'Cancelar',
	confirmText = 'Confirmar',
	isCreateForm = false,
}: Props) => {
	const formik = useFormik({
		validateOnChange: false,
		validateOnBlur: false,
		initialValues: isCreateForm
			? {
					nombre: '',
					descripcion: '',
					timeInactivityAgent: 0,
					timeInactivityClient: 0,
					timeMaxInitConversation: 0,
			  }
			: split,
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
			title={isCreateForm ? 'Crear Split' : 'Actualizar Split'}
			closeButtonText={cancelText}
			confirmButtonText={confirmText}
			formikFormId="splits-form"
			onClose={cancelAction}
		>
			<FormDialog onSubmit={formik.handleSubmit} id="splits-form">
				{/* Nombre split */}
				<TextField
					id="nombre"
					name="nombre"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.nombre}
					error={Boolean(formik.errors.nombre)}
					label="Nombre del Split"
					placeholder="Nombre del Split"
					variant="outlined"
					helperText={formik.errors.nombre}
					InputProps={{
						inputProps: {
							maxLength: 30,
						},
					}}
				/>
				{/* Descripción de Split */}
				<TextField
					id="descripcion"
					name="descripcion"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.descripcion}
					helperText={formik.errors.descripcion}
					error={Boolean(formik.errors.descripcion)}
					label="Descripción del Split"
					placeholder="Descripción del Split"
					variant="outlined"
					multiline
					maxRows={4}
					InputProps={{
						inputProps: {
							maxLength: 100,
						},
					}}
				/>
				{/* Tiempo de desconexión del Asesor (segundos) */}
				<TextField
					id="timeInactivityAgent"
					name="timeInactivityAgent"
					type="number"
					onChange={formik.handleChange}
					value={formik.values.timeInactivityAgent}
					helperText={formik.errors.timeInactivityAgent}
					error={Boolean(formik.errors.timeInactivityAgent)}
					label="Tiempo de desconexión del Asesor (segundos)"
					placeholder="Tiempo de desconexión del Asesor (segundos)"
					variant="outlined"
				/>
				{/* Tiempo de desconexión del Cliente (segundos) */}
				<TextField
					id="timeInactivityClient"
					name="timeInactivityClient"
					type="number"
					onChange={formik.handleChange}
					value={formik.values.timeInactivityClient}
					helperText={formik.errors.timeInactivityClient}
					error={Boolean(formik.errors.timeInactivityClient)}
					label="Tiempo de desconexión del Cliente (segundos)"
					placeholder="Tiempo de desconexión del Cliente (segundos)"
					variant="outlined"
				/>
				{/* Tiempo de espera para el Inicio de conversación (segundos) */}
				<TextField
					id="timeMaxInitConversation"
					name="timeMaxInitConversation"
					type="number"
					onChange={formik.handleChange}
					value={formik.values.timeMaxInitConversation}
					helperText={formik.errors.timeMaxInitConversation}
					error={Boolean(formik.errors.timeMaxInitConversation)}
					label="Tiempo de espera para el Inicio de conversación (segundos)"
					placeholder="Tiempo de espera para el Inicio de conversación (segundos)"
					variant="outlined"
				/>
			</FormDialog>
		</AlertDialog>
	)
}
