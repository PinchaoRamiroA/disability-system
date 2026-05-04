import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { DialogContentText, useMediaQuery, useTheme } from '@mui/material'
import { ConfirmationModalType } from '@/types/Modal'

export const ConfirmationModal = (props: ConfirmationModalType) => {
	const {
		open,
		handleClose,
		children,
		title,
		contentText = '',
		confirmAction,
		confirmButtonText = 'Confirmar',
		disableButton = false,
		styles,
		backdropProps,
		maxWidth = 'sm',
	} = props

	const theme = useTheme()
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

	return (
		<div>
			<Dialog
				fullScreen={fullScreen}
				open={open}
				onClose={handleClose}
				aria-labelledby="responsive-dialog-title"
				fullWidth
				maxWidth={maxWidth}
				sx={styles}
				slotProps={{
					backdrop: {
						style: { ...backdropProps },
					},
					root: {
						style: { ...backdropProps },
					},
				}}
			>
				<DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
				<DialogContent dividers>
					<DialogContentText>{contentText}</DialogContentText>
					{children}
				</DialogContent>
				<DialogActions>
					<Button
						autoFocus
						onClick={handleClose}
						color="secondary"
						variant="outlined"
					>
						Cancelar
					</Button>
					<Button
						onClick={confirmAction}
						autoFocus
						color="secondary"
						variant="contained"
						disabled={disableButton}
					>
						{confirmButtonText}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
