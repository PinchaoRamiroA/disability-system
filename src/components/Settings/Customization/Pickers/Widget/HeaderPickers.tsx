import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { ColorPicker } from '@/components/Settings/ColorPicker'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	updateHeader,
	widgetPreviewSelector,
} from '@/store/slices/widget-config-preview'
import { widgetCurrentColorsSelector } from '@/store/slices/widgetConfig'

export const HeaderPickers = () => {
	const dispatch = useAppDispatch()
	const {
		colores: { header },
	} = useAppSelector(widgetPreviewSelector)
	const { header: currentHeader } = useAppSelector(
		widgetCurrentColorsSelector
	)

	const [background, setBackground] = useState(header.background)
	const [color, setColor] = useState(header.color)

	useEffect(() => {
		dispatch(updateHeader({ background, color }))
	}, [background, color])

	return (
		<Grid item container xs={12} flexDirection={'column'}>
			<Grid item xs={12}>
				<Typography variant="h6">Panel superior</Typography>
			</Grid>
			<Grid item xs="auto">
				<ColorPicker
					color={background}
					label="Color de fondo"
					setColor={setBackground}
					initColor={currentHeader.background}
				/>
				<ColorPicker
					color={color}
					label="Color de fuente"
					setColor={setColor}
					initColor={currentHeader.color}
				/>
			</Grid>
		</Grid>
	)
}
