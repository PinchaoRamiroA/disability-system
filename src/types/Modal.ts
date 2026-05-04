import { Breakpoint, SxProps } from '@mui/material'
import { ChildrenType } from './Children'

export interface ModalType {
	open: boolean
	handleClose: () => void
}

export interface ConfirmationModalType extends ModalType {
	children?: ChildrenType
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
