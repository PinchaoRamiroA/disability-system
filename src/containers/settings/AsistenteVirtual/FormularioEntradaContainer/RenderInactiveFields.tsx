import React from 'react'
import { GridDivider } from '@/components/GridDivider'
import { FormEntrada } from '@/types/Settings/asistente-virtual/FormularioEntrada'
import { Grid, Typography } from '@mui/material'
import { FieldPreview } from './FieldPreview'

interface Props {
	fields: FormEntrada[]
}

export const RenderInactiveFields = ({ fields }: Props) => {
	return (
		<>
			<GridDivider my={1} padding={false} />

			{/* Texto informativo */}
			<Grid item xs={12}>
				<Typography variant="h6">Campos inactivos</Typography>
			</Grid>

			{/* Visualización de campos inactivos */}
			<Grid item container columnSpacing={2}>
				{fields.map((field, i) => (
					<FieldPreview key={i} field={field} draggable={false} />
				))}
			</Grid>
		</>
	)
}
