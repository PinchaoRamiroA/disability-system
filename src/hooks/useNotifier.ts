import { useSnackbar } from 'notistack'

const useNotifier = () => {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()

	return {
		enqueueSnackbar,
		closeSnackbar,
	}
}

export default useNotifier