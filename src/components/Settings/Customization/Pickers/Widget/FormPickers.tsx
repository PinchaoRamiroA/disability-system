import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { ColorPicker } from '@/components/Settings/ColorPicker'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	updateFormButtons,
	widgetPreviewSelector,
} from '@/store/slices/widget-config-preview'
import { widgetCurrentColorsSelector } from '@/store/slices/widgetConfig'

export const FormPickers = () => {
	const dispatch = useAppDispatch()
	const {
		colores: { steps },
	} = useAppSelector(widgetPreviewSelector)
	const { steps: currentSteps } = useAppSelector(widgetCurrentColorsSelector)

	const [background, setBackground] = useState(steps.buttons.background)
	const [color, setColor] = useState(steps.buttons.color)

	useEffect(() => {
		dispatch(updateFormButtons({ background, color }))
	}, [background, color])

	return (
		<Grid item container xs={12} flexDirection={'column'}>
			<Grid item xs="auto">
				<Typography variant="h6">Botones del formulario</Typography>
			</Grid>
			<Grid item xs="auto">
				<ColorPicker
					color={background}
					label="Color de fondo"
					setColor={setBackground}
					initColor={currentSteps.buttons.background}
				/>
				<ColorPicker
					color={color}
					label="Color de fuente"
					setColor={setColor}
					initColor={currentSteps.buttons.color}
				/>
			</Grid>
		</Grid>
	)
}
