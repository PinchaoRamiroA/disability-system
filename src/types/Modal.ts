import { Breakpoint, SxProps } from '@mui/material'

export interface ModalType {
	open: boolean
	handleClose: () => void
}

export interface ConfirmationModalType extends ModalType {
	children?: React.ReactNode
	title: string
	contentText?: string
	confirmAction: () => void
	confirmButtonText?: string
	disableButton?: boolean
	styles?: SxProps
	backdropProps?: {
		top?: string | number
		left?: string | number
		right?: string | number
		bottom?: string | number
	}
	maxWidth?: Breakpoint
}