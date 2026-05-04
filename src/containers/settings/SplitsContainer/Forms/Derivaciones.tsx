import React, { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import { Derivacion, Splits } from '@/types/Splits'
import { Autocomplete, Grid, TextField } from '@mui/material'
import { GridContainer } from '@/components/GridContainer'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { createSplitDerive } from '@/store/slices/splits'
import { DraggableZone } from './DraggableZone'
import { AlertDialog } from '@/components/Dialog'
import { useSplitContext } from '@/hooks/useSplitContext'

interface Props {
	open: boolean
	handleClose: () => void
	splits: Splits[]
}

export default function Derivaciones({ open, handleClose, splits }: Props) {
	const dispatch = useAppDispatch()
	const { currentSplit, setCurrentSplit } = useSplitContext()
	const { derivaciones } = currentSplit
	const [splitsDisponibles, setSplitsDisponibles] = useState<Splits[]>(splits)
	const [splitSelected, setSplitsSelected] = useState<Splits | null>(null)

	// Seleccionar splits disponibles
	const handleSetValue = (newValue: Splits | null) => {
		setSplitsSelected(newValue)
		// Agregar a lista de derivados y eliminar de disponibles
		if (newValue) {
			const priority = derivaciones.length + 1
			dispatch(
				createSplitDerive({
					priority,
					split_derive: newValue.idSplit,
					split_origin: currentSplit.idSplit,
				})
			).then((res) => {
				// La derivación es exitosa
				if (res.meta.requestStatus === 'fulfilled') {
					// limpiar autocomplete
					setSplitsSelected(null)

					// Eliminar split de array de splits disponibles y agregarlo en splits derivados
					setSplitsDisponibles(
						splitsDisponibles.filter(
							(split) => split.idSplit !== newValue.idSplit
						)
					)
					setCurrentSplit({
						...currentSplit,
						derivaciones: derivaciones.concat(
							res.payload as Derivacion
						),
					})
				}
			})
		}
	}

	// Setear derivaciones disponibles
	useEffect(() => {
		if (derivaciones.length) {
			const splitsDerivados = derivaciones.map(
				(derivacion) => derivacion.split_derive
			)
			setSplitsDisponibles(
				splits.filter((item) => !splitsDerivados.includes(item.idSplit))
			)
		}
	}, [currentSplit, splits])

	return (
		<React.Fragment>
			<AlertDialog
				open={open}
				title={`Derivaciones split ${currentSplit.nombre}`}
				onClose={handleClose}
				confirmButtonText="Cerrar"
			>
				<GridContainer px={1}>
					<Grid item xs={12}>
						<Typography variant="body1" p={1}>
							<strong>
								{derivaciones.length
									? 'Splits derivados (selecciona y arrastra para reorganizar la prioridad)'
									: 'Selecciona un split para agregarlo a la lista de derivados'}
							</strong>
						</Typography>
					</Grid>

					<DraggableZone />
					<Grid item xs={12}>
						<Autocomplete
							options={splitsDisponibles}
							getOptionLabel={(option) => option.nombre ?? ''}
							value={splitSelected}
							fullWidth
							onChange={(_, values) => handleSetValue(values)}
							renderOption={(props, option) => (
								<li {...props} key={option.idSplit}>
									{option.nombre}
								</li>
							)}
							renderInput={(params) => (
								<TextField
									{...params}
									name="splits"
									label="Agregar split"
								/>
							)}
							ListboxProps={{
								style: { backgroundColor: '#f9f9f9' },
							}}
						/>
					</Grid>
				</GridContainer>
			</AlertDialog>
		</React.Fragment>
	)
}
