import React from 'react'
import { Grid, Tabs, Tab, Typography } from '@mui/material'
import { FormConfigMode } from '@/types/Settings/asistente-virtual/FormularioEntrada'

interface Props {
	mode: FormConfigMode
	setMode: (mode: FormConfigMode) => void
}

export const ConfigMode = ({ mode, setMode }: Props) => {
	const handleTabChange = (
		_: React.SyntheticEvent,
		newValue: FormConfigMode
	) => {
		setMode(newValue)
	}

	return (
		<Grid item xs={12}>
			<Typography variant="h6" gutterBottom>
				Modo de Configuración
			</Typography>
			<Tabs
				value={mode}
				onChange={handleTabChange}
				indicatorColor="primary"
				textColor="primary"
				sx={{ mb: mode === 'add-remove' ? 2 : 'auto' }}
			>
				<Tab value="add-remove" label="Agregar/Quitar campos" />
				<Tab value="reorder" label="Ordenar campos" />
			</Tabs>
		</Grid>
	)
}
