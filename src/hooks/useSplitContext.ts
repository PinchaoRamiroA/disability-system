import { SplitContext } from '@/contexts/SplitContext'
import { useContext } from 'react'

export const useSplitContext = () => {
	const context = useContext(SplitContext)

	if (!context) {
		throw new Error(
			'useSplitContext must be used within a SplitContextProvider'
		)
	}

	return context
}
