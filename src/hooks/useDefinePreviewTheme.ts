import { setThemeOptions } from '@/styles/theme/themeOptions'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { useMemo } from 'react'
import { useAppSelector } from './useReduxHooks'
import { esES } from '@mui/material/locale'
import { dashboardPreviewSelector } from '@/store/slices/dashboard-config-preview'

export const useDefinePreviewTheme = () => {
	const resource = useAppSelector(dashboardPreviewSelector)

	return useMemo(
		() => responsiveFontSizes(createTheme(setThemeOptions(resource), esES)),
		[resource]
	)
}
