import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { validate } from './validate'
import { AlertDialog } from '@/components/Dialog'
import { FormDialog } from '@/components/Dialog/styles'
import { TextField } from '@mui/material'
import { Causal } from '@/types/Causales'

interface Props {
	open: boolean
	causal: Partial<Causal>
	confirmAction: (company: Partial<Causal>) => void
	cancelAction: (company?: Partial<Causal>) => void
	confirmText?: string
	cancelText?: string
	isCreateForm?: boolean
}

export const CausalForm = ({
	cancelAction,
	confirmAction,
	open,
	causal,
	cancelText = 'Cancelar',
	confirmText = 'Confirmar',
	isCreateForm = false,
}: Props) => {
	const formik = useFormik<Partial<Causal>>({
		validateOnChange: false,
		validateOnBlur: false,
		initialValues: isCreateForm ? { nombre: '', descripcion: '' } : causal,
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
			title={isCreateForm ? 'Crear Causal' : 'Actualizar Causal'}
			closeButtonText={cancelText}
			confirmButtonText={confirmText}
			formikFormId="causal-form"
			onClose={cancelAction}
		>
			<FormDialog onSubmit={formik.handleSubmit} id="causal-form">
				{/* Nombre split */}
				<TextField
					id="nombre"
					name="nombre"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.nombre}
					error={Boolean(formik.errors.nombre)}
					label="Nombre del Causal"
					placeholder="Nombre del Causal"
					variant="outlined"
					helperText={formik.errors.nombre}
					InputProps={{
						inputProps: {
							maxLength: 100,
						},
					}}
				/>
				{/* Descripción de Causal */}
				<TextField
					id="descripcion"
					name="descripcion"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.descripcion}
					helperText={formik.errors.descripcion}
					error={Boolean(formik.errors.descripcion)}
					label="Descripción del causal"
					placeholder="Descripción del causal"
					variant="outlined"
					multiline
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
