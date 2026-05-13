import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useTheme } from '@mui/material/styles'
import { Button, DialogActions, useMediaQuery } from '@mui/material'


interface Props {
	open: boolean
	onClose?: () => void
	description?: React.ReactNode
	title: string
	children?: React.ReactNode
	actions?: boolean
	closeButtonText?: string
	confirmButtonText?: string
	confirmAction?: () => void
	formikFormId?: string
	submitting?: boolean
	fullWidth?: boolean
	cancelOut?: boolean
	backdropProps?: {
		top?: string | number
		left?: string | number
		right?: string | number
		bottom?: string | number
	}
}

export function AlertDialog({
	open,
	onClose,
	description,
	title,
	children,
	actions = true,
	closeButtonText = 'Cancelar',
	confirmButtonText = 'Aceptar',
	confirmAction,
	formikFormId,
	submitting = false,
	fullWidth = false,
	cancelOut,
	backdropProps,
}: Props) {
	const theme = useTheme()
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

	const handleClose = () => {
		// Quitar el foco del elemento activo antes de cerrar
		document.activeElement instanceof HTMLElement &&
			document.activeElement.blur()

		// Ejecutar la función onClose si está definida
		onClose?.()
	}

	return (
		<Dialog
			maxWidth={false}
			fullScreen={fullScreen}
			open={open}
			onClose={handleClose}
			fullWidth={fullWidth}
			slotProps={{
				backdrop: {
					style: { ...backdropProps },
				},
				root: {
					style: { ...backdropProps },
				},
			}}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent dividers>
				<DialogContentText mb={2}>{description}</DialogContentText>
				{children}
			</DialogContent>
			{actions && (
				<DialogActions>
					{confirmAction || formikFormId ? (
						<>
							{!cancelOut && (
								<Button onClick={handleClose} color="secondary">
									{closeButtonText}
								</Button>
							)}
							<Button
								onClick={confirmAction}
								variant="contained"
								type={formikFormId ? 'submit' : 'button'}
								form={formikFormId}
								disabled={submitting}
								color="secondary"
								id="confirm-btn"
							>
								{confirmButtonText}
							</Button>
						</>
					) : (
						<Button
							onClick={handleClose}
							autoFocus
							variant="contained"
							color="secondary"
						>
							{confirmButtonText}
						</Button>
					)}
				</DialogActions>
			)}
		</Dialog>
	)
}
