import { useEffect, useState } from 'react'
import { importGoogleFont } from '@/utils/helpers/importGoogleFont'

export const useImportGoogleFont = () => {
	const [family, setFamily] = useState('')

	useEffect(() => {
		if (family) {
			const link = importGoogleFont(family)

			return () => {
				document.head.removeChild(link)
			}
		}
	}, [family])

	return {
		importFamily: setFamily,
	}
}
