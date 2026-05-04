import React, { useState } from 'react'
import {
	Box,
	Grid,
	IconButton,
	Paper,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material'
import { Done, RestartAlt } from '@mui/icons-material'
import { FormEntrada } from '@/types/Settings/asistente-virtual/FormularioEntrada'
import { ConfirmationModal } from '@/components/Dialog'
import { useFormEntradaContext } from './useFormEntradaContext'

interface Props {
	field: FormEntrada
}

export const splitWords = (text: string) => {
	const firstLetter = text[0].toUpperCase()
	text = firstLetter + text.slice(1)
	return text.replace(/([A-Z])/g, ' $1').trim()
}

export const EditableField = ({ field }: Props) => {
	const { handleUpdateField, isGrabbing } = useFormEntradaContext()

	const { defaultText, label, name } = field
	const [value, setValue] = useState<string>(label)

	// Popup de confirmación
	const [openConfirmation, setOpenConfirmation] = useState(false)

	// Cambios en Textarea
	const handleChange = (newValue: string) => {
		setValue(newValue)
	}

	// Seterar texto por defecto
	const handleResetDefault = () => {
		if (defaultText) {
			handleChange(defaultText.trim())
			handleUpdateField({ ...field, label: defaultText.trim() }, 'update')
			setOpenConfirmation(false)
		}
	}

	return (
		<React.Fragment>
			<Grid item container xs={12} alignItems="flex-end" my={1}>
				<Grid item xs>
					{/* Nombre del campo Botón para dar valor por defecto  */}
					<Box mb={1} display="flex" alignItems="center">
						<Typography>{splitWords(name)}</Typography>
						<Tooltip title="Usar valor por defecto">
							<IconButton
								onClick={() => setOpenConfirmation(true)}
								color="secondary"
							>
								<RestartAlt />
							</IconButton>
						</Tooltip>
					</Box>
					{/* Textarea para escribir el valor del campo */}
					<Grid item xs>
						<Paper elevation={0}>
							<TextField
								name={name}
								label={splitWords(name)}
								value={isGrabbing ? field.label : value}
								onChange={(e) => handleChange(e.target.value)}
								multiline
								rows={5}
								fullWidth
							/>
						</Paper>
					</Grid>
				</Grid>
				{/* Botón para actualizar valor ingresado en Textarea */}
				<Grid item xs="auto" ml={0.5}>
					<Tooltip title="Actualizar">
						<span>
							<IconButton
								onClick={() =>
									handleUpdateField(
										{
											...field,
											label: value,
										},
										'update'
									)
								}
								disabled={label === value.trim()}
								color="success"
							>
								<Done />
							</IconButton>
						</span>
					</Tooltip>
				</Grid>
			</Grid>

			{/* Popup para confirmar actualización */}
			<ConfirmationModal
				confirmAction={handleResetDefault}
				handleClose={() => setOpenConfirmation(false)}
				open={openConfirmation}
				title={`¿Deseas establecer el siguiente valor por defecto para el campo ${splitWords(
					name
				)}?`}
				confirmButtonText="Confirmar"
			>
				<Typography
					align="center"
					fontSize="0.8rem"
					sx={{
						wordWrap: 'break-word',
						whiteSpace: 'pre-wrap',
					}}
				>
					{defaultText?.trim()}
				</Typography>
			</ConfirmationModal>
		</React.Fragment>
	)
}
