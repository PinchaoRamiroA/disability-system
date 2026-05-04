import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { Button, Grid, Paper, TextField, Typography } from '@mui/material'
import { PauseEvents } from './PauseEvents'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	getParametros,
	parametrosSelector,
	updateParametros,
} from '@/store/slices/parametros'
import { useLoading } from '@/hooks/useLoading'
import { GridDivider } from '@/components/GridDivider'

export const GeneralHumanAgentContainer = () => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()
	const { resource } = useAppSelector(parametrosSelector)
	const [numeroChats, setNumeroChats] = useState(
		resource.nroMaximoChatsAsesor
	)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNumeroChats(Number(e.target.value))
	}

	const handleClick = () => {
		startLoading()

		dispatch(
			updateParametros({
				...resource,
				nroMaximoChatsAsesor: numeroChats,
			})
		).then(stopLoading)
	}

	useEffect(() => {
		setNumeroChats(resource.nroMaximoChatsAsesor)
	}, [resource])

	useEffect(() => {
		dispatch(getParametros()).then(stopLoading)
	}, [])

	return (
		<GridContainer justify="flex-start">
			{/* Configuración de número máximo de chats por asesor */}
			<Grid item xs={12}>
				<Typography variant="h6">
					Configuración de número máximo de chats por asesor
				</Typography>
			</Grid>
			<Grid item xs sm={8} md={4}>
				<Paper elevation={0}>
					<TextField
						size="small"
						value={numeroChats}
						onChange={handleChange}
						fullWidth
						type="number"
						label="Número máximo de chats por asesor"
						inputProps={{
							min: 1,
						}}
					/>
				</Paper>
			</Grid>
			<Grid item xs="auto">
				<Button
					color="secondary"
					variant="contained"
					onClick={handleClick}
				>
					Actualizar
				</Button>
			</Grid>

			<GridDivider />

			{/* Configuración de eventos de pausa */}
			<Grid item xs={12}>
				<PauseEvents />
			</Grid>
		</GridContainer>
	)
}
