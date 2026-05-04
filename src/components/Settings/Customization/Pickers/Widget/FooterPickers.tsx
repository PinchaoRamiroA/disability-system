import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { ColorPicker } from '@/components/Settings/ColorPicker'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	updateChatFooter,
	widgetPreviewSelector,
} from '@/store/slices/widget-config-preview'
import { widgetCurrentColorsSelector } from '@/store/slices/widgetConfig'

export const FooterPickers = () => {
	const dispatch = useAppDispatch()
	const {
		colores: { footer },
	} = useAppSelector(widgetPreviewSelector)

	const [background, setBackground] = useState(footer.background)
	const [color, setColor] = useState(footer.icons)

	const { footer: currentFooter } = useAppSelector(
		widgetCurrentColorsSelector
	)

	useEffect(() => {
		dispatch(updateChatFooter({ background, icons: color }))
	}, [background, color])

	return (
		<Grid item container xs={12} flexDirection={'column'}>
			<Grid item xs={12}>
				<Typography variant="h6">Envío de mensajes</Typography>
			</Grid>
			<Grid item xs="auto">
				<ColorPicker
					color={background}
					label="Color de fondo"
					setColor={setBackground}
					initColor={currentFooter.background}
					position="top"
				/>
				<ColorPicker
					color={color}
					label="Color de fuente iconos"
					setColor={setColor}
					initColor={currentFooter.icons}
					position="top"
				/>
			</Grid>
		</Grid>
	)
}
