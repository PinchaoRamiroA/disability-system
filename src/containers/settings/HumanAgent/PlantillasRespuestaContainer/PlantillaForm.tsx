import React, { useEffect } from 'react'
import { FormDialog } from '@/components/Dialog/styles'
import { TextField } from '@mui/material'
import { useFormik } from 'formik'
import { validate } from './validate'
import { AlertDialog } from '@/components/Dialog'
import { NormalizedPlantillaRespuesta } from '@/types/Settings/asesor-humano/plantillas-respuesta'

interface Props {
	open: boolean
	plantilla?: NormalizedPlantillaRespuesta
	handleConfirm: (company: NormalizedPlantillaRespuesta) => void
	handleClose: (company?: NormalizedPlantillaRespuesta) => void
	update?: boolean
}

export const PlantillaForm = ({
	open,
	plantilla,
	handleConfirm,
	handleClose,
	update = false,
}: Props) => {
	// Inicializar formik
	const formik = useFormik<NormalizedPlantillaRespuesta>({
		validateOnChange: false,
		validateOnBlur: false,
		initialValues:
			update && plantilla
				? { ...plantilla }
				: {
						id: 0,
						idTemplate: 0,
						templateContent: '',
						templateName: '',
				  },
		validate: validate(),
		onSubmit: (values) => {
			values.templateContent = values.templateContent?.trim()
			values.templateName = values.templateName?.trim()

			handleConfirm(values)
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
			title={update ? 'Actualizar plantilla' : 'Crear plantilla'}
			confirmButtonText={update ? 'Actualizar' : 'Crear'}
			closeButtonText={'Cancelar'}
			onClose={handleClose}
			formikFormId="create-plantilla-form"
			submitting={formik.isSubmitting}
		>
			<FormDialog
				onSubmit={formik.handleSubmit}
				id="create-plantilla-form"
			>
				{/* Nombre de la plantilla */}
				<TextField
					id="templateName"
					name="templateName"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.templateName}
					error={Boolean(formik.errors.templateName)}
					label="Nombre de la plantilla"
					placeholder="Nombre de la plantilla"
					variant="outlined"
					helperText={formik.errors.templateName}
					InputProps={{
						inputProps: {
							maxLength: 100,
						},
					}}
				/>
				{/* Contenido de la plantilla */}
				<TextField
					id="templateContent"
					name="templateContent"
					type="text"
					onChange={formik.handleChange}
					value={formik.values.templateContent}
					helperText={formik.errors.templateContent}
					error={Boolean(formik.errors.templateContent)}
					label="Contenido de la plantilla"
					placeholder="Contenido de la plantilla"
					variant="outlined"
					inputProps={{
						form: {
							autoComplete: 'off',
						},
						maxLength: 600,
					}}
					multiline
					maxRows={3}
				/>
			</FormDialog>
		</AlertDialog>
	)
}
