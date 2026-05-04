import { PreviewTabsContext } from '@/contexts/PreviewTabsContext'
import { useContext } from 'react'

export const usePreviewTabsContext = () => {
	const context = useContext(PreviewTabsContext)

	if (!context) {
		throw new Error('usePreviewTabsContext must be used within a Provider')
	}

	return context
}
