import React, { useEffect, useState } from 'react'
import { Button, Grid, Paper, TextField, Typography } from '@mui/material'
import {
	ExpiracionSesion,
	PostExpiracionSesionParams,
} from '@/types/Settings/asistente-virtual/Expiracion'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { updateExpiracionConfig } from '@/store/slices/settings/asistente-virtual/expiracion-sesion'
import { useLoading } from '@/hooks/useLoading'

interface Props {
	avisoExpiracion: ExpiracionSesion
	idOrg: number
}

export const MensajeAviso = ({ avisoExpiracion, idOrg }: Props) => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()
	const [mensaje, setMensaje] = useState<string>('')
	const [time, setTime] = useState<number>(0)

	const handleClick = (timeField = false) => {
		startLoading()
		const params: PostExpiracionSesionParams = {
			idOrg,
			payload: {
				idSessionExpirationType:
					avisoExpiracion.idSessionExpirationType,
			},
		}

		// Se va a actualizar el campo Tiempo
		if (timeField) {
			params.payload.closingTime = time
		}
		// Se va a actualizar el campo Mensaje
		else {
			params.payload.clientMessage = mensaje
		}

		dispatch(updateExpiracionConfig(params)).then(stopLoading)
	}

	useEffect(() => {
		setMensaje(avisoExpiracion.clientMessage)
		setTime(avisoExpiracion.closingTime)
	}, [avisoExpiracion])

	return (
		<>
			<Grid item xs={12}>
				<Typography variant="h6">
					Tiempo Inactividad Cliente Aviso
				</Typography>
			</Grid>
			<Grid item xs sm={8} md={4}>
				<Paper elevation={0}>
					<TextField
						multiline
						maxRows={4}
						size="small"
						value={mensaje}
						onChange={(e) => {
							setMensaje(e.target.value)
						}}
						fullWidth
						label="Mensaje"
						InputProps={{
							inputProps: {
								maxLength: 255,
							},
						}}
					/>
				</Paper>
			</Grid>
			{/* Mensaje de aviso de cierre */}
			<Grid item xs="auto">
				<Button
					color="primary"
					variant="contained"
					onClick={() => handleClick()}
					disabled={
						mensaje === avisoExpiracion.clientMessage ||
						mensaje?.trim().length === 0
					}
				>
					Actualizar
				</Button>
			</Grid>
			<Grid item xs={12} />

			<Grid item xs sm={8} md={4}>
				<Paper elevation={0}>
					<TextField
						size="small"
						value={time}
						onChange={(e) => {
							const value = e.target.value
							if (value.length <= 11) {
								// Máximo 11 dígitos
								setTime(Number(value))
							}
						}}
						fullWidth
						type="number"
						label="Tiempo en segundos"
						inputProps={{
							min: 0,
						}}
					/>
				</Paper>
			</Grid>
			<Grid item xs="auto">
				<Button
					color="primary"
					variant="contained"
					onClick={() => handleClick(true)}
					disabled={time === avisoExpiracion.closingTime}
				>
					Actualizar
				</Button>
			</Grid>
		</>
	)
}
