import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { ColorPicker } from '@/components/Settings/ColorPicker'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { updatePrimaryColor } from '@/store/slices/dashboard-config-preview'
import { currentColorsSelector } from '@/store/slices/dashboard-config'

export const PrimaryColorPicker = () => {
	const dispatch = useAppDispatch()
	const { principal } = useAppSelector(currentColorsSelector)

	const [background, setBackground] = useState('#fff')
	const [color, setColor] = useState('#fff')

	useEffect(() => {
		setBackground(principal.background)
		setColor(principal.color)
	}, [principal])

	useEffect(() => {
		dispatch(updatePrimaryColor({ background, color }))
	}, [background, color])

	return (
		<Grid item container xs={12} flexDirection={'column'} mb={1}>
			<Grid item xs={12}>
				<Typography variant="h6">Color principal</Typography>
			</Grid>

			<Grid item xs="auto">
				<ColorPicker
					color={background}
					label="Color de fondo"
					setColor={setBackground}
					initColor={principal.background}
				/>
				<ColorPicker
					color={color}
					label="Color de fuente"
					setColor={setColor}
					initColor={principal.color}
				/>
			</Grid>
		</Grid>
	)
}
