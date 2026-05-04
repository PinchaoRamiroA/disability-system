import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { ColorPicker } from '@/components/Settings/ColorPicker'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	updateMensajeAsesor,
	updateMensajeCliente,
} from '@/store/slices/dashboard-config-preview'
import { currentHAColorsSelector } from '@/store/slices/dashboard-config'

export const ChatBodyPickers = () => {
	const dispatch = useAppDispatch()
	const { mensajeAsesor, mensajeCliente } = useAppSelector(
		currentHAColorsSelector
	)

	const [backgroundAsesor, setBackgroundAsesor] = useState('')
	const [colorAsesor, setColorAsesor] = useState('')

	const [backgroundCliente, setBackgroundCliente] = useState('')
	const [colorCliente, setColorCliente] = useState('')

	useEffect(() => {
		setBackgroundAsesor(mensajeAsesor.background)
		setColorAsesor(mensajeAsesor.color)
		setBackgroundCliente(mensajeCliente.background)
		setColorCliente(mensajeCliente.color)
	}, [mensajeAsesor, mensajeCliente])

	useEffect(() => {
		dispatch(
			updateMensajeAsesor({
				background: backgroundAsesor,
				color: colorAsesor,
			})
		)
	}, [backgroundAsesor, colorAsesor])

	useEffect(() => {
		dispatch(
			updateMensajeCliente({
				background: backgroundCliente,
				color: colorCliente,
			})
		)
	}, [backgroundCliente, colorCliente])

	return (
		<Grid item container xs={12} flexDirection={'column'}>
			<Grid item xs={12}>
				<Typography variant="h6">Mensajes asesor</Typography>
			</Grid>

			<Grid item xs="auto" mb={1}>
				<ColorPicker
					color={backgroundAsesor}
					label="Color de fondo"
					setColor={setBackgroundAsesor}
					initColor={mensajeAsesor.background}
				/>
				<ColorPicker
					color={colorAsesor}
					label="Color de fuente"
					setColor={setColorAsesor}
					initColor={mensajeAsesor.color}
				/>
			</Grid>

			<Grid item xs={12}>
				<Typography variant="h6">Mensajes cliente</Typography>
			</Grid>
			<Grid item xs="auto" mb={1}>
				<ColorPicker
					color={backgroundCliente}
					label="Color de fondo"
					setColor={setBackgroundCliente}
					initColor={mensajeCliente.background}
					position="top"
				/>
				<ColorPicker
					color={colorCliente}
					label="Color de fuente"
					setColor={setColorCliente}
					initColor={mensajeCliente.color}
					position="top"
				/>
			</Grid>
		</Grid>
	)
}
