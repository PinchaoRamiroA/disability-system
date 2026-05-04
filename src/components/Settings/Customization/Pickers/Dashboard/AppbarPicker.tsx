import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { ColorPicker } from '@/components/Settings/ColorPicker'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { updateHeader } from '@/store/slices/dashboard-config-preview'
import { currentColorsSelector } from '@/store/slices/dashboard-config'

export const AppbarPicker = () => {
	const dispatch = useAppDispatch()
	const { header } = useAppSelector(currentColorsSelector)

	const [background, setBackground] = useState('')
	const [color, setColor] = useState('')

	useEffect(() => {
		setBackground(header.background)
		setColor(header.color)
	}, [header])

	useEffect(() => {
		dispatch(updateHeader({ background, color }))
	}, [background, color])

	return (
		<Grid item container xs={12} flexDirection={'column'} mb={1}>
			<Grid item xs={12}>
				<Typography variant="h6">Appbar</Typography>
			</Grid>
			<Grid item xs="auto">
				<ColorPicker
					color={background}
					label="Color de fondo"
					setColor={setBackground}
					initColor={header.background}
				/>
				<ColorPicker
					color={color}
					label="Color de fuente"
					setColor={setColor}
					initColor={header.color}
				/>
			</Grid>
		</Grid>
	)
}
