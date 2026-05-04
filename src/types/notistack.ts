import { CloseReason, SnackbarKey } from 'notistack'

export interface IEnqueueSnackbar extends EnqueueSnackbar {
	key: string
}

export type EnqueueSnackbar = {
	message?: string
	options?: Partial<IEnqueueOptions>
	dismissed?: boolean
}

export type snackType = 'serverError' | 'clientError'

export type CloseSnackbarOptions = {
	key: string
	dismissAll?: boolean
}

interface IEnqueueOptions {
	/** Type of the snackbar */
	variant: 'default' | 'error' | 'success' | 'warning' | 'info'
	anchorOrigin: {
		vertical: 'top' | 'bottom'
		horizontal: 'left' | 'center' | 'right'
	}
	/** Event fired when user clicks on action button (if any) */
	onClickAction(): void
	onClose(
		event: React.SyntheticEvent<unknown, Event> | null,
		reason: CloseReason,
		myKey: SnackbarKey | undefined
	): void
	/**
	 * You can pass material-ui Snackbar props here, and they will be applied to this individual snackbar.
	 * for example, this particular snackbar will be dismissed after 1sec.
	 */
	autoHideDuration: number
}
