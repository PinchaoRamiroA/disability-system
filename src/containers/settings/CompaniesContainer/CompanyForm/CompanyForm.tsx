import { ButtonGroupDialog, FormDialog } from '@/components/Dialog/styles'
import { NormalizedCompany } from '@/types/Company'
import { Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'

interface Props {
	company: Partial<NormalizedCompany>
	confirmAction: (company: Partial<NormalizedCompany>) => void
	cancelAction: (company?: Partial<NormalizedCompany>) => void
	confirmText?: string
	cancelText?: string
}

const validate = (values: Partial<NormalizedCompany>) => {
	const errors: Partial<NormalizedCompany> = {}

	if (!values.name) {
		errors.name = 'Requerido'
	} else if (values.name.length > 30) {
		errors.name = 'Campo no debe ser mayor a 30 carácteres'
	}
	if (!values.schemaName) {
		errors.schemaName = 'Requerido'
	} else if (!/^[_\w-]*$/.test(values.schemaName)) {
		errors.schemaName = 'Formato invalido'
	} else if (values.schemaName.length > 20) {
		errors.schemaName = 'Campo no debe ser mayor a 20 carácteres'
	}

	return errors
}

export const CompanyForm = ({
	company,
	confirmAction,
	cancelAction,
	confirmText,
	cancelText,
}: Props) => {
	const formik = useFormik({
		initialValues: company,
		validate,
		onSubmit: (values) => {
			confirmAction(values)
			formik.resetForm()
		},
	})

	return (
		<FormDialog onSubmit={formik.handleSubmit}>
			<TextField
				id="name"
				name="name"
				type="text"
				onChange={formik.handleChange}
				value={formik.values.name}
				error={Boolean(formik.errors.name)}
				label="Nombre empresa"
				placeholder="Ventas y Servicios"
				variant="outlined"
				helperText={formik.errors.name}
			/>
			<ButtonGroupDialog>
				<Button variant="contained" onClick={() => cancelAction()}>
					{cancelText ?? 'Cancelar'}
				</Button>
				<Button variant="contained" color="secondary" type="submit">
					{confirmText ?? 'Confirmar'}
				</Button>
			</ButtonGroupDialog>
		</FormDialog>
	)
}
