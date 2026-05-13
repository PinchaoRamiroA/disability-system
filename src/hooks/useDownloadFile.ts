import { useSnackbar } from 'notistack'

export const useDownloadFile = () => {
	const { enqueueSnackbar } = useSnackbar()

	const downloadFile = async (url: string, name: string) => {
		try {
			const response = await fetch(url)
			const blob = await response.blob()
			const downloadUrl = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.style.display = 'none'
			a.href = downloadUrl
			a.download = name
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(downloadUrl)
		} catch (err) {
			enqueueSnackbar('Error al descargar el archivo', { variant: 'error' })
		}
	}

	return {
		downloadFile,
	}
}