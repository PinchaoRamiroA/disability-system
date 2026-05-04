import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './useReduxHooks'
import { useSnackbar } from 'notistack'
import { removeSnackbar, selectNotifications } from '@/store/slices/notistack'

let displayed: string[] = []

const useNotifier = () => {
	const dispatch = useAppDispatch()
	const notifications = useAppSelector(selectNotifications)
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()

	const storeDisplayed = (id: string) => {
		displayed = [...displayed, id]
	}

	const removeDisplayed = (id: string) => {
		displayed = [...displayed.filter((key) => id !== key)]
	}

	useEffect(() => {
		notifications.forEach(
			({ key, message, options = {}, dismissed = false }) => {
				if (dismissed) {
					// dismiss snackbar using notistack
					closeSnackbar(key)
					return
				}

				// do nothing if snackbar is already displayed
				if (displayed.includes(key)) return

				// display snackbar using notistack
				enqueueSnackbar(message, {
					key,
					...options,
					onClose: (event, reason, myKey) => {
						if (options.onClose) {
							options.onClose(event, reason, myKey)
						}
					},
					onExited: (event, myKey) => {
						// remove this snackbar from redux store
						dispatch(removeSnackbar(myKey as string))
						removeDisplayed(myKey as string)
					},
					autoHideDuration: 2000,
				})

				// keep track of snackbars that we've displayed
				storeDisplayed(key)
			}
		)
	}, [notifications, closeSnackbar, enqueueSnackbar, dispatch])

	return {
		enqueueSnackbar,
	}
}

export default useNotifier
