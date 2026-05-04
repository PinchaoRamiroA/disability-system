import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { ColorPicker } from '@/components/Settings/ColorPicker'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { updateSecondaryColor } from '@/store/slices/dashboard-config-preview'
import { currentColorsSelector } from '@/store/slices/dashboard-config'

export const SecondaryColorPicker = () => {
	const dispatch = useAppDispatch()
	const { secundario } = useAppSelector(currentColorsSelector)

	const [background, setBackground] = useState('')
	const [color, setColor] = useState('')

	useEffect(() => {
		setBackground(secundario.background)
		setColor(secundario.color)
	}, [secundario])

	useEffect(() => {
		dispatch(updateSecondaryColor({ background, color }))
	}, [background, color])

	return (
		<Grid item container xs={12} flexDirection={'column'} mb={1}>
			<Grid item xs={12}>
				<Typography variant="h6">Color secundario</Typography>
			</Grid>

			<Grid item xs="auto">
				<ColorPicker
					color={background}
					label="Color de fondo"
					setColor={setBackground}
					initColor={secundario.background}
				/>
				<ColorPicker
					color={color}
					label="Color de fuente"
					setColor={setColor}
					initColor={secundario.color}
				/>
			</Grid>
		</Grid>
	)
}
