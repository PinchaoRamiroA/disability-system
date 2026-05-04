import React from 'react'
import { CONTAINER_HEIGHT_CALC } from '@/utils/constants/containerHeight'
import { Close } from '@mui/icons-material'
import { Box, Button, Grid, Typography, useTheme } from '@mui/material'

export const PopupTab = () => {
	const { widgetPopup } = useTheme()

	return (
		<Box
			height={`calc(${CONTAINER_HEIGHT_CALC} - 3em)`}
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
		>
			<Box height={'20%'} />
			<Grid
				container
				item
				xs={12}
				height={'50%'}
				width={'50%'}
				// flexDirection='column'
				border={1}
				borderColor={'#ddcbcb'}
				borderRadius={2}
			>
				<Grid
					container
					item
					xs={12}
					height={'20%'}
					bgcolor={widgetPopup.header.background}
					color={widgetPopup.header.color}
					borderBottom={1}
					borderColor="#ddcbcb"
					borderRadius="7px 7px 0 0"
					p={2}
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography variant="h6">Título del Popup</Typography>
					<Close />
				</Grid>
				<Grid
					item
					xs={12}
					height={'60%'}
					bgcolor={widgetPopup.body.background}
					color={widgetPopup.body.color}
					p={2}
				>
					Lorem ipsum dolor sit, amet consectetur adipisicing elit.
					Officia, dicta iusto quam modi corporis omnis aliquid
				</Grid>
				<Grid
					container
					item
					xs={12}
					height={'20%'}
					borderTop={1}
					borderColor="#ddcbcb"
					alignItems={'center'}
					justifyContent={'end'}
					gap={2}
					pr={2}
				>
					<Button
						size="small"
						sx={{
							':hover': {
								bgcolor: widgetPopup.buttons.default.background,
								opacity: 0.9,
							},
							bgcolor: widgetPopup.buttons.default.background,
							color: widgetPopup.buttons.default.color,
						}}
					>
						Cancelar
					</Button>
					<Button
						size="small"
						sx={{
							':hover': {
								bgcolor: widgetPopup.buttons.primary.background,
								opacity: 0.9,
							},
							bgcolor: widgetPopup.buttons.primary.background,
							color: widgetPopup.buttons.primary.color,
						}}
					>
						Confirmar
					</Button>
				</Grid>
			</Grid>
			<Box height={'20%'} />
		</Box>
	)
}
