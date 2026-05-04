import { useContext } from 'react'
import { FilterContext } from '@/contexts/FilterContext'

export const useFilterContext = () => {
	const context = useContext(FilterContext)

	if (!context) {
		throw new Error('useFilterContext must be used within a Provider')
	}

	return context
}
