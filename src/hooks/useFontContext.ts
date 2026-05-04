import { FontContext } from '@/contexts/FontContext'
import { useContext } from 'react'

export const useFontContext = () => {
	const context = useContext(FontContext)

	if (!context) {
		throw new Error(
			'useFontContext must be used within a FontContextProvider'
		)
	}

	return context
}
