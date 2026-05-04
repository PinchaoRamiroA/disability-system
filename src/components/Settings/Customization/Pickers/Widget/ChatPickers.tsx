import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { ColorPicker } from '@/components/Settings/ColorPicker'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	updateMensajeAsesor,
	updateMensajeCliente,
	widgetPreviewSelector,
} from '@/store/slices/widget-config-preview'
import { widgetCurrentHAColorsSelector } from '@/store/slices/widgetConfig'

export const ChatPickers = () => {
	const dispatch = useAppDispatch()
	const {
		colores: {
			chat: {
				messages: { agent, client },
			},
		},
	} = useAppSelector(widgetPreviewSelector)
	const { agent: currentAsesor, client: currentCliente } = useAppSelector(
		widgetCurrentHAColorsSelector
	)

	const [backgroundAsesor, setBackgroundAsesor] = useState(agent.background)
	const [colorAsesor, setColorAsesor] = useState(agent.color)

	const [backgroundCliente, setBackgroundCliente] = useState(
		client.background
	)
	const [colorCliente, setColorCliente] = useState(client.color)

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
		<Grid item container xs={12} gap={0.5} flexDirection={'column'}>
			<Grid item xs={12}>
				<Typography variant="h6">Chat</Typography>
			</Grid>

			<Grid item xs="auto">
				<Typography>Mensajes asesor</Typography>
				<ColorPicker
					color={backgroundAsesor}
					label="Color de fondo"
					setColor={setBackgroundAsesor}
					initColor={currentAsesor.background}
				/>
				<ColorPicker
					color={colorAsesor}
					label="Color de fuente"
					setColor={setColorAsesor}
					initColor={currentAsesor.color}
				/>
			</Grid>
			<Grid item xs={12} />

			<Grid item xs="auto">
				<Typography>Mensajes cliente</Typography>
				<ColorPicker
					color={backgroundCliente}
					label="Color de fondo"
					setColor={setBackgroundCliente}
					initColor={currentCliente.background}
					position="top"
				/>
				<ColorPicker
					color={colorCliente}
					label="Color de fuente"
					setColor={setColorCliente}
					initColor={currentCliente.color}
					position="top"
				/>
			</Grid>
		</Grid>
	)
}
