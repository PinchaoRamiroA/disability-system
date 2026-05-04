import React from 'react'
import { CONTAINER_HEIGHT_CALC } from '@/utils/constants/containerHeight'
import {
	AttachFile,
	MoreVert,
	Send,
	SentimentVerySatisfied,
} from '@mui/icons-material'
import {
	Box,
	Grid,
	IconButton,
	OutlinedInput,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material'
import { useFontContext } from '@/hooks/useFontContext'
import { MiniAppbar } from './MiniAppbar'

export const AsesorTab = () => {
	const { fontStyles } = useFontContext()
	const {
		asesorHumano: { footer, header, mensajeAsesor, mensajeCliente },
	} = useTheme()

	return (
		<Grid
			container
			height={`calc(${CONTAINER_HEIGHT_CALC} - 3em)`}
			overflow={'auto'}
		>
			{/* Appbar */}
			<MiniAppbar icons={false} />

			{/* Chat header */}
			<Tooltip title="Chat header">
				<Grid
					item
					container
					xs={12}
					px={2}
					height="10%"
					alignItems="center"
					boxSizing="content-box"
					borderBottom={1}
					borderColor="#ddcbcb"
					sx={{
						backgroundColor: header.background,
						color: header.color,
					}}
				>
					<Grid item xs>
						<Typography variant="body2">
							<strong>Split:</strong> General
						</Typography>
						<Typography variant="body2">
							<strong>Email:</strong> ejemplo@mail.com
						</Typography>
					</Grid>
					<Grid item xs>
						<Typography variant="body2">
							<strong>Teléfono:</strong> 3003003003
						</Typography>
						<Typography variant="body2">
							<strong>Ubicación:</strong> Colombia
						</Typography>
					</Grid>
					<Grid item xs="auto">
						<IconButton color="inherit">
							<MoreVert />
						</IconButton>
					</Grid>
				</Grid>
			</Tooltip>
			{/* Chat messages */}
			<Grid
				container
				item
				xs={12}
				height={'65%'}
				overflow={'auto'}
				gap={2}
				p={2}
			>
				<Grid item xs={12}>
					<Tooltip title="Mensaje asesor">
						<Box
							bgcolor={mensajeCliente.background}
							color={mensajeCliente.color}
							width={300}
							p={2}
							borderRadius="0 16px 16px"
							border={1}
							borderColor="#ccc"
						>
							<Typography sx={fontStyles}>
								Lorem ipsum dolor, sit amet consectetur
								adipisicing elit. Temporibus odit
							</Typography>
							<Typography variant="body2" textAlign="end">
								<small>25/01/2024 11:11:02</small>
							</Typography>
						</Box>
					</Tooltip>
				</Grid>
				<Grid item xs={12} display="flex" justifyContent="flex-end">
					<Tooltip title="Mensaje cliente">
						<Box
							bgcolor={mensajeAsesor.background}
							color={mensajeAsesor.color}
							width={400}
							p={2}
							borderRadius="16px 0 16px 16px"
							border={1}
							borderColor="#ccc"
						>
							<Typography sx={fontStyles}>
								Lorem ipsum dolor, sit amet consectetur
								adipisicing elit. Temporibus odit
							</Typography>
							<Typography
								sx={fontStyles}
								variant="body2"
								textAlign="end"
							>
								<small>25/01/2024 11:11:02</small>
							</Typography>
						</Box>
					</Tooltip>
				</Grid>
				<Grid item xs={12} justifyContent={'center'}>
					<Tooltip title="Mensaje asesor">
						<Box
							bgcolor={mensajeCliente.background}
							color={mensajeCliente.color}
							width={350}
							p={2}
							borderRadius="0 16px 16px"
							border={1}
							borderColor="#ccc"
						>
							<Typography sx={fontStyles}>
								Lorem ipsum dolor, sit amet consectetur
								adipisicing elit. Temporibus odit
							</Typography>
							<Typography
								sx={fontStyles}
								variant="body2"
								textAlign="end"
							>
								<small>25/01/2024 11:11:02</small>
							</Typography>
						</Box>
					</Tooltip>
				</Grid>
			</Grid>
			{/* Footer */}
			<Tooltip title="Footer">
				<Grid
					bgcolor={footer.background}
					container
					item
					xs={12}
					height={'13%'}
					px={2}
					borderTop={1}
					borderColor="#ddcbcb"
					alignItems={'center'}
					boxSizing="content-box"
				>
					<Tooltip title="Footer icons">
						<Grid item xs="auto" color={footer.iconsColor}>
							<SentimentVerySatisfied />
							<AttachFile />
						</Grid>
					</Tooltip>
					<Grid item xs mx={2}>
						<OutlinedInput
							multiline
							fullWidth
							placeholder="Escribe tu mensaje"
							size="small"
							sx={{ backgroundColor: 'white' }}
						/>
					</Grid>
					<Tooltip title="Footer icons">
						<Grid item xs="auto" color={footer.iconsColor}>
							<Send />
						</Grid>
					</Tooltip>
				</Grid>
			</Tooltip>
		</Grid>
	)
}
