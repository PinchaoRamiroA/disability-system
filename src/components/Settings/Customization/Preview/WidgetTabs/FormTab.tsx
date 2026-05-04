import React from 'react'
import { CONTAINER_HEIGHT_CALC } from '@/utils/constants/containerHeight'
import { Box, Button, Grid, Typography, useTheme } from '@mui/material'
import { LogoTab } from '../DashboardTabs/LogoTab'

export const FormTab = () => {
	const { toolbar, widgetForm } = useTheme()

	return (
		<Grid container height={`calc(${CONTAINER_HEIGHT_CALC} - 3em)`}>
			<Grid
				container
				item
				xs={12}
				p={2}
				bgcolor={toolbar.background}
				color={toolbar.color}
				height={'50%'}
				justifyContent="space-evenly"
				alignItems="center"
				flexDirection="column"
			>
				<Typography variant="h5" align="center">
					Nombre del Bot
				</Typography>
				<Box>
					<LogoTab borderRadius widget height={100} width={100} />
				</Box>
				<Typography align="center">Texto descriptivo</Typography>
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					position="relative"
				>
					<Box
						sx={{
							position: 'absolute',
							backgroundColor: widgetForm.background,
							// color: formFont,
							borderRadius: '50px',
							height: 60,
							width: 60,
							border: 3,
							borderColor: widgetForm.color,
							color: widgetForm.color,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							top: 'calc(50%)',
							left: -160,
						}}
					>
						1
					</Box>
					<Box
						sx={{
							position: 'absolute',
							backgroundColor: widgetForm.background,
							// color: formFont,
							borderRadius: '50px',
							height: 60,
							width: 60,
							border: 3,
							borderColor: widgetForm.color,
							color: widgetForm.color,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							top: 'calc(50%)',
							left: -30,
						}}
					>
						2
					</Box>
					<Box
						sx={{
							position: 'absolute',
							backgroundColor: widgetForm.background,
							// color: formFont,
							borderRadius: '50px',
							height: 60,
							width: 60,
							border: 3,
							borderColor: widgetForm.color,
							color: widgetForm.color,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							top: 'calc(50%)',
							left: 100,
						}}
					>
						3
					</Box>
				</Box>
			</Grid>
			<Grid
				container
				item
				xs={12}
				p={2}
				justifyContent="space-evenly"
				flexDirection="column"
				height={'50%'}
				// bgcolor={chatBg}
			>
				<Typography align="center">
					Lorem ipsum, dolor sit amet consectetur adipisicing elit.
					Eos reprehenderit suscipit sed eum repellat doloremque
					cupiditate nemo hic ipsam esse, fugit sit nobis quibusdam
					molestias nisi accusantium, magni voluptatum ullam?
				</Typography>
				<Button
					variant="contained"
					sx={{
						':hover': {
							bgcolor: widgetForm.background,
							opacity: 0.9,
						},
						borderRadius: 20,
						background: widgetForm.background,
						color: widgetForm.color,
					}}
				>
					Siguiente
				</Button>
			</Grid>
		</Grid>
	)
}
