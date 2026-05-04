import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { ColorPicker } from '@/components/Settings/ColorPicker'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { updateChatFooter } from '@/store/slices/dashboard-config-preview'
import { currentHAColorsSelector } from '@/store/slices/dashboard-config'

export const FooterPicker = () => {
	const dispatch = useAppDispatch()
	const { footer } = useAppSelector(currentHAColorsSelector)

	const [background, setBackground] = useState('')
	const [iconsColor, setIconsColor] = useState('')

	useEffect(() => {
		setBackground(footer.background)
		setIconsColor(footer.iconsColor)
	}, [footer])

	useEffect(() => {
		dispatch(updateChatFooter({ background, iconsColor }))
	}, [background, iconsColor])

	return (
		<Grid item container xs={12} flexDirection={'column'}>
			<Grid item xs={12}>
				<Typography variant="h6">Footer</Typography>
			</Grid>
			<Grid item xs="auto">
				<ColorPicker
					color={background}
					label="Color de fondo"
					setColor={setBackground}
					initColor={footer.background}
					position="top"
				/>
				<ColorPicker
					color={iconsColor}
					label="Color de iconos"
					setColor={setIconsColor}
					initColor={footer.iconsColor}
					position="top"
				/>
			</Grid>
		</Grid>
	)
}
