import { useContext } from 'react'
import { FormEntradaContext } from './FormEntradaContext'

export const useFormEntradaContext = () => {
	const context = useContext(FormEntradaContext)

	if (!context) {
		throw new Error(
			'useFormEntradaContext must be used within a LoadingProvider'
		)
	}

	return context
}
