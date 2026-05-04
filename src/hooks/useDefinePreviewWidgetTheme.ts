import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { useMemo } from 'react'
import { useAppSelector } from './useReduxHooks'
import { esES } from '@mui/material/locale'
import { widgetPreviewSelector } from '@/store/slices/widget-config-preview'
import { setThemeOptionsWidget } from '@/styles/theme/themeOptionsWidget'

export const useDefinePreviewWidgetTheme = () => {
	const resource = useAppSelector(widgetPreviewSelector)

	return useMemo(
		() =>
			responsiveFontSizes(
				createTheme(setThemeOptionsWidget(resource), esES)
			),
		[resource]
	)
}
