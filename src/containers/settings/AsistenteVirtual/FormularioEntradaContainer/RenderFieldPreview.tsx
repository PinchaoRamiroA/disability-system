import React from 'react'
import {
	FormConfigMode,
	FormEntrada,
} from '@/types/Settings/asistente-virtual/FormularioEntrada'
import {
	Autocomplete,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Grid,
	Paper,
	TextField,
	Typography,
} from '@mui/material'
import { EditableField, splitWords } from './EditableField'
import ReactMarkdown from 'react-markdown'

interface Props {
	field: FormEntrada
	mode: FormConfigMode
	showLabel?: boolean
	grabbing?: boolean
}

const RenderField = ({
	field,
	mode,
	showLabel,
}: {
	field: FormEntrada
	mode: FormConfigMode
	showLabel: boolean
}) => {
	if (mode === 'add-remove' && field.editable) {
		if (showLabel) {
			if (field.name === 'generalTextHabeasData') {
				return (
					<Typography align="center" fontSize="0.8rem">
						<ReactMarkdown linkTarget="_blank">
							{field.label}
						</ReactMarkdown>
					</Typography>
				)
			} else if (field.name === 'checkTextHabeasData') {
				return (
					<FormGroup>
						<FormControlLabel
							sx={{
								fontSize: '0.8rem',
								alignItems: 'flex-start',
							}}
							control={<Checkbox sx={{ my: 1 }} size="small" />}
							label={
								<Typography align="center" fontSize="0.8rem">
									<ReactMarkdown linkTarget="_blank">
										{field.label}
									</ReactMarkdown>
								</Typography>
							}
						/>
					</FormGroup>
				)
			}
		}
		return <EditableField field={field} />
	} else if (field.name === 'endCustLocation') {
		return (
			<Grid container display="flex" gap={2}>
				<Grid item xs>
					<Paper elevation={0}>
						<Autocomplete
							options={[]}
							renderInput={(params) => (
								<TextField
									{...params}
									name="departamentos"
									label="Departamentos"
								/>
							)}
							size="small"
							disabled
						/>
					</Paper>
				</Grid>
				<Grid item xs>
					<Paper elevation={0}>
						<Autocomplete
							options={[]}
							renderInput={(params) => (
								<TextField
									{...params}
									name="ciudades"
									label="Ciudades"
								/>
							)}
							size="small"
							disabled
						/>
					</Paper>
				</Grid>
			</Grid>
		)
	} else {
		return (
			<Paper elevation={0}>
				<TextField
					label={
						field.editable ? (
							<div>
								{splitWords(field.name) + ': '}
								<small>{field.label}</small>
							</div>
						) : (
							field.label
						)
					}
					fullWidth
					size="small"
					disabled
				/>
			</Paper>
		)
	}
}

export const RenderFieldPreview = ({
	field,
	mode,
	showLabel = false,
}: Props) => {
	return (
		<>
			{showLabel && !field.editable && (
				<Typography>{field.label}</Typography>
			)}

			<RenderField field={field} mode={mode} showLabel={showLabel} />
		</>
	)
}
