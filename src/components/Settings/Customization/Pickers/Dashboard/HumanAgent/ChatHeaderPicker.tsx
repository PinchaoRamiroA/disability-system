import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { ColorPicker } from '@/components/Settings/ColorPicker'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { updateChatHeader } from '@/store/slices/dashboard-config-preview'
import { currentHAColorsSelector } from '@/store/slices/dashboard-config'

export const ChatHeaderPicker = () => {
	const dispatch = useAppDispatch()
	const { header } = useAppSelector(currentHAColorsSelector)

	const [background, setBackground] = useState('')
	const [color, setColor] = useState('')

	useEffect(() => {
		setBackground(header.background)
		setColor(header.color)
	}, [header])

	useEffect(() => {
		dispatch(updateChatHeader({ background, color }))
	}, [background, color])

	return (
		<Grid item container xs={12} flexDirection={'column'} mb={1}>
			<Grid item xs={12}>
				<Typography variant="h6">Chat Header</Typography>
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
