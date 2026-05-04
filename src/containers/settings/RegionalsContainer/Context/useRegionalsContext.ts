import { useContext } from 'react'
import { RegionalsContext } from './RegionalsContext'

export const useRegionalContext = () => {
	const context = useContext(RegionalsContext)

	if (!context) {
		throw new Error(
			'useRegionalContextContext must be used within a LoadingProvider'
		)
	}

	return context
}
