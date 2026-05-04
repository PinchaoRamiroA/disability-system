import React, { ChangeEvent } from 'react'
import { Button, Grid, Typography } from '@mui/material'
import { useAppDispatch } from '@/hooks/useReduxHooks'
import { updateLogoFile } from '@/store/slices/dashboard-config'
import { IsWidgetConfig } from '@/types/Settings/General/Dashboard'
import { updateAvatarFile } from '@/store/slices/widgetConfig'

export const LogoPicker = ({ widget = false }: IsWidgetConfig) => {
	const dispatch = useAppDispatch()

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const fileList = event.target.files
		if (fileList && fileList.length > 0) {
			if (widget) {
				dispatch(updateAvatarFile(fileList[0]))
			} else {
				dispatch(updateLogoFile(fileList[0]))
			}
		}
	}

	return (
		<Grid item container xs={12} flexDirection="column" mb={1}>
			<Grid item xs={12}>
				<Typography variant="h6">
					{widget ? 'Avatar' : 'Logo'}
				</Typography>
			</Grid>
			<Grid item xs="auto">
				<input
					accept="image/*"
					id="contained-button-file"
					multiple={false}
					type="file"
					onChange={handleFileChange}
					style={{ display: 'none' }}
				/>
				<label htmlFor="contained-button-file">
					<Button variant="contained" component="span">
						Seleccionar imagen
					</Button>
				</label>
			</Grid>
		</Grid>
	)
}
