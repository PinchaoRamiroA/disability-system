import { getFile } from '@/services/api/uploadFile'
import { getFileFailed } from '@/utils/constants/snackbars/files'
import { detectUnauthorizedPromise } from '@/utils/helpers/detectUnauthorized'
import { useSnackbar } from 'notistack'

export const useDownloadFile = () => {
	const { enqueueSnackbar } = useSnackbar()

	const downloadFile = async (reference: string, name: string) => {
		try {
			const res = await getFile(reference)
			const url = URL.createObjectURL(new Blob([res]))
			const a = document.createElement('a')
			a.style.display = 'none'
			a.href = url
			a.download = name
			a.click()
			URL.revokeObjectURL(url)
		} catch (err) {
			detectUnauthorizedPromise(err, () =>
				downloadFile(reference, name)
			).catch(() => {
				const { message, options } = getFileFailed
				enqueueSnackbar(message, options)
			})
		}
	}

	return {
		downloadFile,
	}
}
