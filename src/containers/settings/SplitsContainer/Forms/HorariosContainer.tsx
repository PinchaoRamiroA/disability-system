import React from 'react'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { Splits } from '@/types/Splits'
import { Box, Tooltip } from '@mui/material'
import { Horario } from './Horario'

interface Props {
	open: boolean
	handleClose: () => void
	split: Splits
}

export const HorariosContainer = ({ open, handleClose, split }: Props) => {
	return (
		<React.Fragment>
			<Dialog
				maxWidth="md"
				open={open}
				onClose={handleClose}
				// TransitionComponent={Transition}
				fullWidth
			>
				<AppBar
					sx={{
						position: 'relative',
					}}
					color="secondary"
				>
					<Toolbar>
						<Typography
							sx={{ ml: 2, flex: 1 }}
							variant="h6"
							component="div"
						>
							Configurar horarios de split{' '}
							<strong>{split.nombre}</strong>
						</Typography>
						<Tooltip title="Cerrar">
							<IconButton
								edge="start"
								color="inherit"
								onClick={handleClose}
								aria-label="close"
							>
								<CloseIcon />
							</IconButton>
						</Tooltip>
					</Toolbar>
				</AppBar>
				<Box>
					<Horario
						horarios={split.horariosAtencion}
						idSplit={split.idSplit}
					/>
				</Box>
			</Dialog>
		</React.Fragment>
	)
}
